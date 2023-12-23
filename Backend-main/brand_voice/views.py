from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from django.http import JsonResponse
from subscriptions.check_subscription import restrict_user,restrict_user_views
from subscriptions.models import Subscription

from template.open_api_request import summarize_in_tone
from rest_framework.permissions import IsAuthenticated , AllowAny

from brand_voice.serializers import BrandVoiceSerializer,BrandVoiceGetSerializer,BrandVoicePatchSerializer
from brand_voice.models import Brandvoice

from rest_framework import viewsets, pagination
from django.db.models import Q
class PageNumberPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


from subscriptions.models import Subscription
from team_members.models import Workspace,InitialWorkShopOfUser

class BrandVoiceViewSets(viewsets.ViewSet):
    permission_classes=[IsAuthenticated]
    def list(self,request):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        search_query = request.GET.get('search')
        BrandVoiceViewSetInstance = Brandvoice.objects.filter(user_id=request.user,trash=False).order_by('-created_at')
        if search_query:
            BrandvoiceInstance = BrandVoiceViewSetInstance.filter(Q(brand_voice__icontains=search_query) | Q(content_summarize__icontains=search_query),trash=False).order_by('-created_at')

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(BrandVoiceViewSetInstance, request)

        if page is not None:
            serializer = BrandVoiceGetSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = BrandVoiceGetSerializer(BrandVoiceViewSetInstance, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)    

    def retrieve(self,request,pk=None):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        if id is not None:
            try:
                BrandvoiceInstance = Brandvoice.objects.get(id=pk,trash=False)
                serializer = BrandVoiceGetSerializer(BrandvoiceInstance)
                return Response(serializer.data)
            except:
                return Response({'message':'doesnt exits'},status=400)

    def create(self,request):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        resp={}

        ins_workspace=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        instance=Subscription.objects.get(user_id=ins_workspace.owner_of_workspace)

        # breakpoint()
        if instance.status=="trial":
            check_brand_voice=Brandvoice.objects.filter(user_id=request.user,trash=False).count()
            if check_brand_voice>3:
                return Response({"message":"That's limit for trail"},status=400)

        serializer = BrandVoiceSerializer(data=request.data,context={'user':request})
        if serializer.is_valid():
            serializer.save()
            instance=Brandvoice.objects.get(id=serializer.instance.id)
            resp["brand_voice"]=instance.brand_voice
            resp["content_summarize"]=instance.content_summarize
            return Response(resp,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self,request,pk):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        # try:
        BrandvoiceInstance = Brandvoice.objects.get(pk=id)
        resp={}
        if BrandvoiceInstance.user_id.id==request.user.id:
            if request.data.get('project_id',None)=="no folder":
                request.data["project_id"]=None
            serializer = BrandVoicePatchSerializer(BrandvoiceInstance,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                data = Brandvoice.objects.get(pk=serializer.data["id"])
                resp["brand_voice"]=data.brand_voice
                resp["content_summarize"]=data.content_summarize
                return Response(resp,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        return Response({'message':'update not permitted'},status=401)

    # def retrieve(self,request,pk=None):
    #     id = pk
    #     if id is not None:
    #         try:
    #             DocumentInstance = Documents.objects.get(id=pk,trash=False)
    #             serializer = DocumentSerializer(DocumentInstance)
    #             return Response(serializer.data)
    #         except:
    #             return Response({'message':'doesnt exits'},status=400)


from rest_framework.views import APIView
from rest_framework.response import Response
import os

from bs4 import BeautifulSoup
import requests

class ExtractTextFromUrls(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        
        ins_workspace=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        instance=Subscription.objects.get(user_id=ins_workspace.owner_of_workspace)

        if instance.status=="trial":
            check_brand_voice=Brandvoice.objects.filter(user_id=request.user,trash=False).count()
            if check_brand_voice>=3:
                return Response({"message":"That's limit for trail"},status=400)

        urls = request.data.get('urls')
        if request.data.get('brand_voice',None) is None:
            return Response({'error': 'Brand voice ??'}, status=400)
        if not urls:
            return Response({'error': 'Please provide a list of URLs in the "urls" parameter.'}, status=400)

        extracted_text = []
        for url in urls:
            try:
                response = requests.get(url)
                response.raise_for_status()  # Check for request errors
                html_content = response.text
                # soup = BeautifulSoup(html_content, 'html.parser')

                # Assuming you have already parsed the HTML content into a BeautifulSoup object
                soup = BeautifulSoup(html_content, 'html.parser')


                # text_content = soup.get_text()
                # extracted_text.append(text_content)

                # Get all the text within the HTML, but remove any script and style tags
                for script in soup(['script', 'style']):
                    script.extract()

                # Get the cleaned text
                cleaned_text = soup.get_text()

                # You can further clean the text by removing extra whitespace and newline characters
                cleaned_text = ' '.join(cleaned_text.split())

                # brand_name=Brandvoice.objects.filter(brand_voice=request.data.get('brand_voice',None)).exists()
                # if brand_name:
                #     return Response({'error': 'Brand name already exits'}, status=400)
                content_summarize_resp=summarize_in_tone(str(cleaned_text[0][:500]))
        
                instance=Brandvoice.objects.create(user_id=request.user,content=cleaned_text,brand_voice=request.data.get('brand_voice',None),content_summarize=content_summarize_resp)
                # breakpoint()
                brand_voice_data=instance.brand_voice
                content_summarize_resp=instance.content_summarize
                return Response({
                    "brand_voice": brand_voice_data,
                    "content_summarize":content_summarize_resp
                }, status=200)
            except requests.exceptions.RequestException as e:
                cleaned_text.append(f'Error: {str(e)}')
                return Response({"message": cleaned_text}, status=400)






# =========for file ================
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
from docx import Document
from PyPDF2 import PdfReader
import os
import tempfile
import uuid
from docx import Document
from PyPDF2 import PdfReader

def read_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as text_file:
        return text_file.read()

def read_word_document(file_path):
    temp_txt_path = None
    # try:
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_txt_path = os.path.join(temp_dir, 'temp.txt')
        doc = Document(file_path)
        with open(temp_txt_path, 'w', encoding='utf-8') as temp_txt_file:
            for para in doc.paragraphs:
                temp_txt_file.write(para.text + '\n')
        with open(temp_txt_path, 'r', encoding='utf-8') as temp_txt_file:
            return temp_txt_file.read()
    # finally:
    #     if temp_txt_path:
    #         os.remove(temp_txt_path)

def read_pdf_file(file_path):
    pdf_reader = PdfReader(file_path)
    file_content = ''
    for page in pdf_reader.pages:
        file_content += page.extract_text()
    return file_content

class ExtractDataFromFiles(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):

        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)

        if Subscription.objects.get(user_id=request.user).status=="trial":
            if Brandvoice.objects.filter(user_id=request.user).count()>3:
                return Response({"error":"You have reached the limit"},status=400)

        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        file = request.FILES.get('file')
        brand_voice = request.data.get('brand_voice')

        if brand_voice is None:
            return Response({"message": "brand voice name not provided"}, status=400)

        # Check if the uploaded file is a text file, Word document, or PDF
        file_extension = os.path.splitext(file.name)[1].lower()
        if file_extension not in ['.txt', '.docx', '.pdf']:
            return Response({'error': 'Invalid file format. Only text, Word, and PDF files are allowed.'}, status=400)
        
        if file:
            max_file_size = 10 * 1024 * 1024  # 10 MB in bytes
            if file.size <= max_file_size:
                pass
            else:
                return JsonResponse({'error': 'File size exceeds the 10 MB limit'}, status=400)
  
        # Generate a unique filename using UUID
        unique_filename = str(uuid.uuid4()) + file_extension

        # Define the path where you want to save the file (e.g., /tmp)
        save_path = os.path.join('/tmp', unique_filename)

        # Save the file to the specified path
        with open(save_path, 'wb') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        

        file_path = save_path
        file_extension = os.path.splitext(save_path)[1].lower()

        try:
            if file_extension == '.txt':
                content = read_text_file(file_path)
            elif file_extension == '.docx':
                content = read_word_document(file_path)
            elif file_extension == '.pdf':
                content = read_pdf_file(file_path)
            else:
                content = None  # Handle unsupported file types
                return Response({'error': "nothing to read"}, status=400)

            '''
                If needed then remove file from tmp
            '''
            # try:
            #     os.remove(file_path)
            # except:
            #     pass

            # Perform validation on file content (You can implement your custom validation logic here)
            # For example, check if the content is empty or not
            if not content.strip():
                return Response({'error': 'File content is empty.'}, status=400)
            # breakpoint()
            content_summarize_resp=summarize_in_tone(str(content[:500]))
            # content_summarize_resp=summarize_in_tone(str(content))
            instance=Brandvoice.objects.create(user_id=request.user,content=content,brand_voice=request.data.get('brand_voice',None),content_summarize=content_summarize_resp)

            brand_voice_data=instance.brand_voice
            content_summarize_resp=instance.content_summarize
            return Response({
                "brand_voice": brand_voice_data,
                "content_summarize":content_summarize_resp
            }, status=200)
            # return Response({'brand_voice': brand_voice, 'content': content}, status=200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)
from django.shortcuts import render
from rest_framework.response import Response
from documentsData.models import Documents 
from documentsData.serializers import DocumentSerializer,DocumentPatchDoumentOnlySerializer,DocumentCreateSerializer,DocumentPatchSerializer
from rest_framework import status
from rest_framework import viewsets

# from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated , AllowAny
# from rest_framework.authentication import BasicAuthentication
# from rest_framework.throttling import UserRateThrottle

# from rest_framework.pagination import PageNumberPagination


from rest_framework import viewsets, pagination
from django.db.models import Q
class PageNumberPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 200

import base64
from team_members.models import Workspace,TeamMemberList
class DocumentViewSet(viewsets.ViewSet):
    permission_classes=[IsAuthenticated]

    def list(self,request):
        search_query = request.GET.get('search')
        workspace_id = request.GET.get('workspace',None)
        if workspace_id is None:
            return Response({'message':'Not permitted'},status=400)
        DocumentInstance = Documents.objects.filter(user_id=request.user,trash=False,workspace_id=workspace_id, project_id=None).order_by('-created_at')
        if search_query:
            DocumentInstance = DocumentInstance.filter(Q(title__icontains=search_query) | Q(document_content__icontains=search_query) | Q(status__icontains=search_query))

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(DocumentInstance, request)

        if page is not None:
            serializer = DocumentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = DocumentSerializer(DocumentInstance, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)  

    def retrieve(self,request,pk=None):
        id = pk
        if id is not None:
            try:
                DocumentInstance = Documents.objects.get(id=pk,trash=False)
                if DocumentInstance.user_id==request.user:
                    serializer = DocumentSerializer(DocumentInstance)
                    return Response(serializer.data)
                else:
                    # check the common workspace
                    request_user_workspace=TeamMemberList.objects.get(Workspace_Id=DocumentInstance.workspace_id,team_member_user=request.user)
                    if request_user_workspace.Workspace_Id==DocumentInstance.workspace_id:
                        if DocumentInstance.visible_by_workspace_member:
                            serializer = DocumentSerializer(DocumentInstance)
                            return Response(serializer.data)
                    return Response({'message':'dont have permission'},status=400)
            except:
                return Response({'message':'dont have permission'},status=400)
            return Response({'message':'dont have permission'},status=400)


    def create(self,request):
        resp_data={}

        if request.data.get('document_content')=="":
            request.data['document_content']="Start From Here"

        serializer = DocumentCreateSerializer(data=request.data,context={'user':request})

        work_space=request.data.get("workspace_id",None)

        if work_space is None or work_space=="":
            return Response({'message':'workspace needed'},status=400)

        if request.data.get('project_id',None)=="default" or request.data.get('project_id',None)=="Select a Folder" or request.data.get('project_id',None)=="Select a Folder" or request.data.get('project_id',None)=="Your content":
            request.data["project_id"]=None
        if serializer.is_valid():
            serializer.save()
            res=serializer.data["document_content"]
            resp_data["id"]=str(serializer.data["id"])
            resp_data["document_content"]=res
            # resp_data["document_content"]=base64.b64decode(res).decode()
            # breakpoint()
            return Response(resp_data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self,request,pk):
        id = pk
        try:
            DocumentsInstance = Documents.objects.get(pk=id)
            request_user_workspace=TeamMemberList.objects.get(Workspace_Id=DocumentsInstance.workspace_id,team_member_user=request.user)
            if request_user_workspace.Workspace_Id==DocumentsInstance.workspace_id:
                if request.data.get('project_id',None)=="default" or request.data.get('project_id',None)=="No Folder" or request.data.get('project_id',None)=="Select a Folder" or request.data.get('project_id',None)=="Select a Folder" or request.data.get('project_id',None)=="Your Content":
                    request.data["project_id"]=None
                serializer = DocumentPatchSerializer(DocumentsInstance,data=request.data,partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data,status=status.HTTP_201_CREATED)
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message':'update not permitted'},status=401)
        except:
            return Response({"message":"doesn't exits"},status=400)
    
    
    def destroy(self,request,pk):
        id = pk
        if id is not None:
            try:
                DocumentsInstance = Documents.objects.get(pk=id)
                if DocumentsInstance.user_id.id==request.user.id:
                    DocumentsInstance.delete()
                    return Response({'message':'Data deleted'})
                return Response({'message':'update not permitted'},status=401)
            except:
                return Response({'message':'doesnt exits'},status=400)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Documents

class DocumentTrashAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        document_ids = data.get('id', [])
        trash = data.get('trash', False)

        try:
            documents_instances = Documents.objects.filter(pk__in=document_ids)

            # Check if the user owns all the documents being updated
            for doc_instance in documents_instances:
                if doc_instance.user_id.id != request.user.id:
                    return Response({'message': 'Update not permitted'}, status=status.HTTP_401_UNAUTHORIZED)

            # Update the trash field for all the documents
            documents_instances.update(trash=trash)

            return Response({'message': 'Documents updated successfully'}, status=status.HTTP_200_OK)

        except Documents.DoesNotExist:
            return Response({'message': 'One or more documents do not exist'}, status=status.HTTP_400_BAD_REQUEST)



class ProjectBulkUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        project_ids = data.get('project_ids', [])
        # Assuming you have a field named "project_id" in the Documents model
        try:
            # Filter the documents with the given project_ids
            documents_instances = Documents.objects.filter(project_id__in=project_ids)

            # Check if the user owns all the documents being updated
            for doc_instance in documents_instances:
                if doc_instance.user_id.id != request.user.id:
                    return Response({'message': 'Update not permitted'}, status=status.HTTP_401_UNAUTHORIZED)

            # Perform bulk update to set the project_id for all the documents
            # Update the "project_id" field with the new project_id value
            new_project_id = "your_new_project_id_here"
            documents_instances.update(project_id=new_project_id)

            return Response({'message': 'Documents updated successfully'}, status=status.HTTP_200_OK)

        except Documents.DoesNotExist:
            return Response({'message': 'One or more documents do not exist'}, status=status.HTTP_400_BAD_REQUEST)



class DocumentTrashDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        document_ids = data.get('id', [])

        try:
            documents_instances = Documents.objects.filter(pk__in=document_ids)
            # Check if the user owns all the documents being deleted
            for doc_instance in documents_instances:
                if doc_instance.user_id.id != request.user.id:
                    return Response({'message': 'Delete not permitted'}, status=status.HTTP_401_UNAUTHORIZED)

            # Delete all the matching documents permanently
            documents_instances.delete()

            return Response({'message': 'Documents deleted successfully'}, status=status.HTTP_200_OK)

        except Documents.DoesNotExist:
            return Response({'message': 'One or more documents do not exist'}, status=status.HTTP_400_BAD_REQUEST)





class DocumentPatchViewSet(viewsets.ViewSet):
    permission_classes=[IsAuthenticated]

    def list(self,request):
        search_query = request.GET.get('search')
        DocumentInstance = Documents.objects.filter(user_id=request.user, trash=True).order_by('-created_at')
        if search_query:
            DocumentInstance = DocumentInstance.filter(Q(title__icontains=search_query) | Q(document_content__icontains=search_query) | Q(status__icontains=search_query))
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(DocumentInstance, request)

        if page is not None:
            serializer = DocumentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = DocumentSerializer(DocumentInstance, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)  

    def partial_update(self,request,pk):
        id = pk
        # try:
        DocumentsInstance = Documents.objects.get(pk=id)
        if DocumentsInstance.user_id.id==request.user.id:
            serializer = DocumentPatchDoumentOnlySerializer(DocumentsInstance,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        else:
            request_user_workspace=TeamMemberList.objects.get(Workspace_Id=DocumentsInstance.workspace_id,team_member_user=request.user)
            if request_user_workspace.Workspace_Id==DocumentsInstance.workspace_id:
            # if DocumentsInstance.editable_by_workspace_member.filter(id=request.user.id).exists():
                serializer = DocumentPatchDoumentOnlySerializer(DocumentsInstance,data=request.data,partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data,status=status.HTTP_201_CREATED)
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message':'update not permitted'},status=401)
        return Response({'message':'update not permitted'},status=401)



from django.http import JsonResponse

def upload_image(request):
    if request.method == 'POST' and request.FILES['image']:
        image = request.FILES['image']
        return JsonResponse({'success': True, 'message': 'Image uploaded successfully'})
    else:
        return JsonResponse({'success': False, 'message': 'No image uploaded or invalid request'})





from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import base64
from docx import Document

from django.http import FileResponse
from io import BytesIO

import base64
from django.http import FileResponse
from docx import Document
from io import BytesIO

from django.http import HttpResponse
import io
from docx import Document
import base64
import re

def sanitize_filename(filename):
    # Replace invalid characters with underscores
    return re.sub(r'[\\/*?:"<>|]', '_', filename)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doc_file(request, data):
    try:
        DocumentsInstance = Documents.objects.get(pk=data)
        data = DocumentsInstance.document_content
        string_data = base64.b64decode(data).decode()
        doc = Document()
        doc.add_paragraph(str(string_data))

        # Sanitize the file name
        sanitized_title = sanitize_filename(DocumentsInstance.title)
        file_name = f'public/static/file/{sanitized_title}__{str(DocumentsInstance.id)}.docx'

        # Save the document
        doc.save(file_name)

        file_directory = f'data/file/{sanitized_title}__{str(DocumentsInstance.id)}.docx'
        return Response({"link": file_directory}, status=status.HTTP_201_CREATED)

    except Documents.DoesNotExist:
        return Response({"message": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message": f"Error generating the document: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from accounts.models import UserAccount

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_edit_permission_doc(request, data):
    try:
        doc_ins = Documents.objects.get(id=data)
        ins_user = UserAccount.objects.get(id=request.data.get('id'))
        try:
            doc_ins.editable_by_workspace_member.remove(ins_user)
            return Response({'message': 'User removed'}, status=200)
        except:
            return Response({'message': 'Failed to remove user'}, status=400)
    except Documents.DoesNotExist:
        return Response({'message': 'Document not found'}, status=400)
    except:
        return Response({'message': 'Something went wrong'}, status=400)


from subscriptions.check_subscription import restrict_user,restrict_user_views
from template.open_api_request import ask_little_more
from accounts.models import GenerateWordRestrictionForUser
from team_members.models import InitialWorkShopOfUser
import re
from accounts.models import UserAccount
from subscriptions.models import Subscription
from template.models import SingleUserTokenGenerated
from template.open_api_request import estimate_tokens_from_text



def create_data_block(text):
    # Split the text into blocks based on "\n"
    text_blocks = text.split('\n')

    # Create a list to store the data blocks
    data_blocks = []

    for block in text_blocks:
        # Create a new data block for each block of text
        data_block = {
            "id": "sheNwCUP5A",  # You may want to generate unique IDs for each block
            "type": "paragraph",
            "data": {
                "text": block.strip(),  # Remove leading/trailing whitespace
                "level": 2
            }
        }
        data_blocks.append(data_block)

    # Create the final data block containing all the individual blocks
    # final_data_block = {
    #     "time": int(time.time()) * 1000,
    #     "blocks": data_blocks
    # }

    return data_blocks

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def doc_question(request):
    data = {"restrict_user": True}
    restriction_to_user={'data': 'Upgrade Your plan'}
    restrict_user_check = restrict_user_views(request.user)

    # restrict user if it's trail

    give_token_for_user=GenerateWordRestrictionForUser.objects.get(user=request.user)
    give_token_for_user=give_token_for_user.words

    # check the status of trail start or ... from workshop
    user_status_init_wrk=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    
    # get the admin of workspace check user for premium template to use
    ins_check_trail_or_not=UserAccount.objects.get(id=user_status_init_wrk.owner_of_workspace.id)

    ins_sub=Subscription.objects.get(user_id=ins_check_trail_or_not)

    instance_user_generated_words=SingleUserTokenGenerated.objects.filter(user_id=request.user).values("token_generated")
    total_token=0
    for user_data in instance_user_generated_words:
        total_token+=int(user_data["token_generated"])


    if ins_sub.status=="trial":
        if int(total_token)>=int(give_token_for_user):
            data_from_open_ai={'role': 'assistant', 'content': 'upgrade a plan'}
            return Response(restriction_to_user,status=200)
    if restrict_user_check is False:
        return Response(restriction_to_user, status=400)
    try:
        response_data_from_api=ask_little_more(request.data.get('ask'))
    
        # Add How many token is generate dy user
        user_init_wrk=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        SingleUserTokenGenerated.objects.create(
            user_id=request.user,
            workspace=user_init_wrk.workspace_id,
            token_generated=estimate_tokens_from_text(response_data_from_api.get('content')))

        from documentsData.serializers import create_data_block

        response_data=create_data_block(response_data_from_api.get('content'))


        # data={
        #     "id": "ew",
        #     "type": "paragraph",
        #     "data": {
        #         "text": "Cricket: The Gentleman's Game",
        #         "level": 2
        #     }
        # }

        # data="Title : cricket <br> Intro : Boom <br> hawa cricket <br> asdasfd"
        # data="first \n second \n third"
        # text_with_br = data.replace('\n', '<br>')
        # breakpoint()
        # return Response(data, status=200)
        # return Response({"data":text_with_br}, status=200)

        return Response({"data":response_data_from_api.get('content').replace('\n', '<br>')}, status=200)
    except:
        return Response({"message":"something went wrong"}, status=400)

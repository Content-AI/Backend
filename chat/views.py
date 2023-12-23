# chat views
from functools import partial
from django.shortcuts import render
from rest_framework.response import Response
from chat.models import ChatRootModel,ChatContentModel
from chat.serializers import ChatRootModelSerializer,ChatContentCreateSerializer,ChatRootGetModelSerializer
from rest_framework import status
from rest_framework import viewsets

import openai

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.authentication import BasicAuthentication
from rest_framework.throttling import UserRateThrottle

from rest_framework.pagination import PageNumberPagination
from template.open_api_request import makechatrequest
from rest_framework import viewsets, pagination
from django.db.models import Q

class PageNumberPagination(pagination.PageNumberPagination):
    page_size = 16
    page_size_query_param = 'page_size'
    max_page_size = 200


class ChatTitleViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def list(self,request):
        
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        search_param = request.query_params.get('search', None)
        queryset = ChatRootModel.objects.filter(user_id=request.user.id, trash=False).order_by("-updated_at")
        
        if search_param:
            queryset = queryset.filter(Q(title__icontains=search_param))
        
        serializer = ChatRootModelSerializer(queryset,many=True)
        return Response(serializer.data)

    def retrieve(self,request,pk=None):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        if id is not None:
            chat_root = ChatRootModel.objects.get(id=pk,trash=False)
            serializer = ChatRootGetModelSerializer(chat_root)
            return Response(serializer.data,status=200)
    
    def create(self,request):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        serializer = ChatRootModelSerializer(data=request.data,context={"user":request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self,request,pk):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        ChatRootData = ChatRootModel.objects.get(pk=id)
        serializer = ChatRootModelSerializer(ChatRootData,data=request.data,partial=True,context={"user":request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Data update'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def destroy(self,request,pk):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        ChatRootData = ChatRootModel.objects.get(pk=id, trash=False)
        ChatRootData.trash=True
        ChatRootData.save()
        return Response({'message':'Data deleted'})
    

from django.http import JsonResponse
from accounts.models import GenerateWordRestrictionForUser
from subscriptions.check_subscription import restrict_user,restrict_user_views
from subscriptions.models import Subscription
from template.models import SingleUserTokenGenerated
from template.open_api_request import estimate_tokens_from_text
from team_members.models import InitialWorkShopOfUser
from brand_voice.models import Brandvoice
import re
from accounts.models import UserAccount


class ChatAskViewSet(viewsets.ViewSet):

    permission_classes = [IsAuthenticated]
    def create(self,request):

        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)

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
                data_from_open_ai=[{"question":request.data.get('question'),"content":"upgrade a plan"}]
                return Response(data_from_open_ai,status=201)

        if restrict_user_check is False:
            return JsonResponse(data, status=400)

        serializer = ChatContentCreateSerializer(data=request.data)
        combined_context=""
        if serializer.is_valid():
            try:
                text = request.data.get('Tone','Default')

                # Extract text inside square brackets
                matches = re.findall(r'\[(.*?)\]', text)

                # Remove "Generate In Tone:" prefix and create a list
                result_list = [match.replace('Generate In Tone:', '') for match in matches]

                for data_tone in result_list:
                    ins_brand=Brandvoice.objects.get(content_summarize=data_tone)
                    info_of_users=ins_brand.content
                    combined_context=str(combined_context)+" "+ str(info_of_users)
            except:
                combined_context="Generate in Tone : Default"
            if combined_context=="Generate in Tone : Default" or combined_context=="":

                data_from_open_ai = makechatrequest(request.data["question"]+"\n"+combined_context)
            else:

                data_from_open_ai = makechatrequest(request.data["question"]+"\n"+"Information of Users : "+combined_context)

            user_init_wrk=InitialWorkShopOfUser.objects.get(user_filter=request.user)

            SingleUserTokenGenerated.objects.create(user_id=request.user,workspace=user_init_wrk.workspace_id,token_generated=estimate_tokens_from_text(data_from_open_ai))
            instance=ChatContentModel.objects.create(
                user_id=request.user,
                chat_root=ChatRootModel.objects.get(id=request.data["chat_root"]),
                question=request.data["question"],
                content=data_from_open_ai.replace('\n', '<br>')
            )

            data=ChatContentModel.objects.filter(id=instance.id).values("question","content")

            return Response(data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

import openai
from rest_framework.views import APIView
from django.http import StreamingHttpResponse

from template.open_api_request import count_token_data,estimate_tokens_from_text
from core.settings import pro

try:
    from template.models import OpenAiToken
    openai.api_key=OpenAiToken.objects.get(id=1).token_generated
except:
    pass


def split_context_into_chunks(combined_context, chunk_size=1000):
    chunks = []
    words = combined_context.split()
    for i in range(0, len(words), chunk_size):
        chunk = ' '.join(words[i:i + chunk_size])
        chunks.append({'role': 'user', 'content': chunk})
    return chunks


@permission_classes([IsAuthenticated])
class ChatResponseView(APIView):

    active_listeners = set()  # Store active listeners
    def response_chat_stream(self,request,combined_context,user_init_wrk):

        user_id = request.user.id  # Unique identifier for the user
        try:
        
            if user_id:
                self.active_listeners.add(user_id)  # Add user to active listeners
        
            generated_content = []

            
            # openai api only takes 3k so need to make it half
            chunks = split_context_into_chunks(combined_context)

            response = openai.ChatCompletion.create(
                model='gpt-4',
                messages=chunks,
                temperature=0.6,
                stream=True
            )
            i=0
            for chunk in response:
                content = chunk["choices"][0]["delta"].get("content", "")
                finish_reason = chunk["choices"][0].get("finish_reason", "")
                i=i+1
                if(finish_reason!="stop"):
                    # content = content.replace("\n","<br>")
                    data = {"current_total": i, "content": content}
                    yield data
                else:
                    data = {"current_total": i, "content": ""}
                    response.close()
                    yield data
                generated_content.append(content)
        finally:
            if user_id in self.active_listeners:

                response_answer_from_openai="".join(generated_content)

                count_token_data(response_answer_from_openai)

                SingleUserTokenGenerated.objects.create(
                                user_id=request.user,
                                workspace=user_init_wrk.workspace_id,
                                token_generated=estimate_tokens_from_text(response_answer_from_openai)
                                )
                instance=ChatContentModel.objects.create(
                    user_id=request.user,
                    chat_root=ChatRootModel.objects.get(id=request.data["chat_root"]),
                    question=request.data["question"],
                    content=response_answer_from_openai
                    # content=response_answer_from_openai.replace('\n', '<br>')
                )

                self.active_listeners.remove(user_id)  # Remove user when they stop listening

    def post(self,request):
        try:
            if len(request.data.get('question',''))<=0:
                return Response({"message":"Provide some details"},status=400)
        except:
                return Response({"message":"Provide some details"},status=400)

        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)

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
                data_from_open_ai=[{"question":request.data.get('question'),"content":"upgrade a plan"}]
                return Response(data_from_open_ai,status=400)

        if restrict_user_check is False:
            return JsonResponse(data, status=400)

        serializer = ChatContentCreateSerializer(data=request.data)
        combined_context=""
        if serializer.is_valid():
            try:
                text = request.data.get('Tone','Default')

                # Extract text inside square brackets
                matches = re.findall(r'\[(.*?)\]', text)

                # Remove "Generate In Tone:" prefix and create a list
                result_list = [match.replace('Generate In Tone:', '') for match in matches]

                for data_tone in result_list:
                    ins_brand=Brandvoice.objects.get(content_summarize=data_tone)
                    info_of_users=ins_brand.content
                    combined_context=str(combined_context)+" "+ str(info_of_users)
            except:
                combined_context="Generate in Tone : Default"

        user_init_wrk=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        try:
            if combined_context=="Generate in Tone : Default" or combined_context=="":
                chat_answer = self.response_chat_stream(request,request.data["question"]+"\n"+combined_context,user_init_wrk)
            else:
                chat_answer = self.response_chat_stream(request,request.data["question"]+"\n"+"Information of Users : "+combined_context,user_init_wrk)
        except:
                chat_answer = self.response_chat_stream(request,request.data["question"]+"\n"+combined_context,user_init_wrk)
        
        response =  StreamingHttpResponse(chat_answer,status=200, content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['Content-Disposition'] = 'attachment'

        '''
             uncomment this line  this on on nginx server configurations
        '''
        if pro==True:
            response['Connection'] = 'keep-alive'
        return response




from chat.thread import ChatThread

@api_view(['GET','POST'])
# @permission_classes([IsAuthenticated])
def ask_question_sync(request):

    # ChatThread(request).start()

    # thread = ChatThread(request)
    # thread.start()

    return Response({"message":str(thread.getName())},status=200)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api_docs.AuthUserWithApi import log_request_user_with_api_key

from rest_framework import status
from rest_framework import viewsets
from core import settings
import base64

from template.models import TemplateAnswerModelOfUser
from template.times_convert import format_time_elapsed
from template.open_api_request import estimate_tokens_from_text
from template.models import Template,Template_Field,Language,ProjectTemplate

from api_docs.serializers import TemplateSerializer,TemplateInnerFieldsSerializer
from template.models import Template
from accounts.models import UserApiKey,UserAccount
from subscriptions.models import SubscribedUser,Subscription
from team_members.models import InitialWorkShopOfUser
from accounts.models import GenerateWordRestrictionForUser,UserTokenGenerated
from template.models import SingleUserTokenGenerated
from team_members.models import Workspace
from template.open_api_request import makeAPIRequest
from rest_framework.decorators import action



import openai
from rest_framework.views import APIView
from django.http import StreamingHttpResponse

from template.open_api_request import count_token_data,estimate_tokens_from_text
from subscriptions.check_subscription import restrict_user,restrict_user_views
from api_docs.serializers import ChatApiContentSerializer
from api_docs.models import ChatAPIContentModel
from template.models import SingleUserTokenGenerated


try:
    from template.models import OpenAiToken
    openai.api_key=OpenAiToken.objects.get(id=1).token_generated
except:
    pass


from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers




def check_text_match(text):
    match_data = None
    ins=Template.objects.filter(title=str(text)).values("what_to_generate")
    if text == str(text):
        match_data = ins[0]["what_to_generate"]
    else:
        match_data = ""
    return match_data


class TemplateViewSet(viewsets.ViewSet):

    # @swagger_auto_schema(
    #     manual_parameters=[
    #         openapi.Parameter('Api-Key', openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True, description='Your API Key')
    #     ],
    #     request_body=openapi.Schema(
    #         type=openapi.TYPE_OBJECT,
    #         properties={
    #             'ids': openapi.Schema(type=openapi.TYPE_STRING,description="Template ID"),
    #             'output_results': openapi.Schema(type=openapi.TYPE_STRING,description="How much output you want to generate max 11"),
    #             'generate': openapi.Schema(type=openapi.TYPE_STRING,description="eg. Blog , AIDA ..."),
    #         }
    #     )
    # )
    # @log_request_user_with_api_key
    # def create(self, request, user_instance):
        
    #     try:
    #         template_temp_id=request.data.get('ids',None)
    #         # generated token is more restrict user
    #         give_token_for_user=GenerateWordRestrictionForUser.objects.get(user=user_instance)
    #         token_generated_by_user=SingleUserTokenGenerated.objects.filter(user_id=user_instance).values("token_generated")
    #         total_token=0
    #         for user_data in token_generated_by_user:
    #             total_token+=int(user_data["token_generated"])

    #         if int(give_token_for_user.words)<int(total_token):
    #             return Response({'message':'Exceeds limit contact our admin '},status=400)

    #         wrk_ins = InitialWorkShopOfUser.objects.get(user_filter=user_instance)
    #         ins_subs = Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)

    #         data = request.data

    #         #  output_results ( how much output user wants ) this need to be in validation
    #         tmp_output_results=data.get("output_results",None)
    #         if tmp_output_results is None:
    #             error_resp = {
    #                 "ids": "Template ID",
    #                 "output_results":"How much Output max is 11"
    #             }
    #             return Response(error_resp,status=400)

    #         try:
    #             check_generate_data=check_text_match(data.get("generate","default"))
    #         except:
    #             return Response({"message":"'generate' filed missing eg. Blog , AIDA"},status=400)
            
    #         from template.models import Template_Field
    #         template_id=Template.objects.get(id=data.get('ids'))
    #         # required data from database exists or not in api post data
    #         template_field_id= Template_Field.objects.filter(template=template_id.id).values('title','required')
    #         required_parameter=[]
    #         for template_inner_fields in template_field_id:
    #             if template_inner_fields["required"]==True:
    #                 required_parameter.append(template_inner_fields["title"])
            
    #         for key in required_parameter:
    #             if key not in data:
    #                 return Response({"message":f"'{key}' filed missing"},status=400)


    #         if tmp_output_results is None:
    #             tmp_output_results=2
    #         data.pop('output_results', None)
    #         data.pop('generate', None)

    #         result_response_data=[]
    #         template_answer_ids=[]
    #         template_id_ = request.data.get('ids',None)
    #         response_with_template_and_project={}

            
    #         try:
    #             try:
    #                 instance_of_template=Template.objects.get(id=template_id_)
    #             except:
    #                 instance_of_template=CustomTemplate.objects.get(id=template_id_)
    #         except:
    #             return Response({"message":"Template not found"},status=400)

    #         data.pop('ids',None)

    #         ask_question_to_gpt = '\n'.join([f"{key}: {value}" for key, value in data.items()]) + '\n [ make it very unique ] '+ check_generate_data
    #         inst_wrk=Workspace.objects.get(id=wrk_ins.workspace_id.id)


    #         if int(tmp_output_results)>=11:
    #             tmp_output_results=2


    #         ins_template= Template.objects.get(id=template_temp_id)


    #         for i in range(1,int(tmp_output_results)+1):
            
    #             response_data_from_api=makeAPIRequest(ask_question_to_gpt)

    #             content = response_data_from_api["content"]
    #             length_of_content=len(content)
    #             response_data_from_api["length_of_content"]=length_of_content
    #             encoded_data = base64.b64encode(content.encode()).decode()
    #             instance = TemplateAnswerModelOfUser(user_id=user_instance,workspace_id=inst_wrk,answer_response=encoded_data,template_id=instance_of_template.id)
    #             instance.save()

    #             instance_length = SingleUserTokenGenerated.objects.create(user_id=user_instance,template_used=ins_template,workspace=inst_wrk,token_generated=estimate_tokens_from_text(content))
    #             template_answer_ids.append(instance)
    #             result_response_data.append(response_data_from_api)

    #         project_template = ProjectTemplate.objects.create(user_id=user_instance)
    #         project_template.template_answer.set(template_answer_ids)
    #         response_with_template_and_project["project_id"]=project_template.id
    #         response_with_template_and_project["data"]=result_response_data
    #         return Response(response_with_template_and_project)
    #     except Exception as e:
    #         # return Response({"message":str(e)},status=400)
    #         return Response({"message":"Fill out all data and template id id needed"},status=400)

 
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter('Api-Key', openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True, description='Your API Key')
    ])
    @log_request_user_with_api_key
    def list(self, request, user_instance, *args, **kwargs):
        print(user_instance)
        queryset = Template.objects.all()
        serializer = TemplateSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Api-Key', openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True, description='Your API Key'),
            openapi.Parameter('id', openapi.IN_PATH, type=openapi.TYPE_STRING, description='Template ID')
        ]
    )
    @log_request_user_with_api_key
    def retrieve(self,request,user_instance,pk=None):
        try:
            query_set = Template.objects.get(id=pk)
            serializer = TemplateInnerFieldsSerializer(query_set)
            return Response(serializer.data)
        except Exception as e:
            return Response({"message":'Template not found'},status=400)



class GenerateTemplateResponse(viewsets.ViewSet):
    

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Api-Key', openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True, description='Your API Key')
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'ids': openapi.Schema(type=openapi.TYPE_STRING,description="Template ID"),
                'output_results': openapi.Schema(type=openapi.TYPE_STRING,description="How much output you want to generate max 11"),
                'generate': openapi.Schema(type=openapi.TYPE_STRING,description="eg. Blog , AIDA ..."),
            }
        )
    )
    @log_request_user_with_api_key
    def create(self, request, user_instance):
        
        try:
            template_temp_id=request.data.get('ids',None)
            # generated token is more restrict user
            give_token_for_user=GenerateWordRestrictionForUser.objects.get(user=user_instance)
            token_generated_by_user=SingleUserTokenGenerated.objects.filter(user_id=user_instance).values("token_generated")
            total_token=0
            for user_data in token_generated_by_user:
                total_token+=int(user_data["token_generated"])

            if int(give_token_for_user.words)<int(total_token):
                return Response({'message':'Exceeds limit contact our admin '},status=400)

            wrk_ins = InitialWorkShopOfUser.objects.get(user_filter=user_instance)
            ins_subs = Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)

            data = request.data

            #  output_results ( how much output user wants ) this need to be in validation
            tmp_output_results=data.get("output_results",None)
            if tmp_output_results is None:
                error_resp = {
                    "ids": "Template ID",
                    "output_results":"How much Output max is 11"
                }
                return Response(error_resp,status=400)

            try:
                check_generate_data=check_text_match(data.get("generate","default"))
            except:
                return Response({"message":"'generate' filed missing eg. Blog , AIDA"},status=400)
            
            from template.models import Template_Field
            template_id=Template.objects.get(id=data.get('ids'))
            # required data from database exists or not in api post data
            template_field_id= Template_Field.objects.filter(template=template_id.id).values('title','required')
            required_parameter=[]
            for template_inner_fields in template_field_id:
                if template_inner_fields["required"]==True:
                    required_parameter.append(template_inner_fields["title"])
            
            for key in required_parameter:
                if key not in data:
                    return Response({"message":f"'{key}' filed missing"},status=400)


            if tmp_output_results is None:
                tmp_output_results=2
            data.pop('output_results', None)
            data.pop('generate', None)

            result_response_data=[]
            template_answer_ids=[]
            template_id_ = request.data.get('ids',None)
            response_with_template_and_project={}

            
            try:
                try:
                    instance_of_template=Template.objects.get(id=template_id_)
                except:
                    instance_of_template=CustomTemplate.objects.get(id=template_id_)
            except:
                return Response({"message":"Template not found"},status=400)

            data.pop('ids',None)

            ask_question_to_gpt = '\n'.join([f"{key}: {value}" for key, value in data.items()]) + '\n [ make it very unique ] '+ check_generate_data
            inst_wrk=Workspace.objects.get(id=wrk_ins.workspace_id.id)


            if int(tmp_output_results)>=11:
                tmp_output_results=2


            ins_template= Template.objects.get(id=template_temp_id)


            for i in range(1,int(tmp_output_results)+1):
            
                response_data_from_api=makeAPIRequest(ask_question_to_gpt)

                content = response_data_from_api["content"]
                length_of_content=len(content)
                response_data_from_api["length_of_content"]=length_of_content
                encoded_data = base64.b64encode(content.encode()).decode()
                instance = TemplateAnswerModelOfUser(user_id=user_instance,workspace_id=inst_wrk,answer_response=encoded_data,template_id=instance_of_template.id)
                instance.save()

                instance_length = SingleUserTokenGenerated.objects.create(user_id=user_instance,template_used=ins_template,workspace=inst_wrk,token_generated=estimate_tokens_from_text(content))
                template_answer_ids.append(instance)
                result_response_data.append(response_data_from_api)

            project_template = ProjectTemplate.objects.create(user_id=user_instance)
            project_template.template_answer.set(template_answer_ids)
            response_with_template_and_project["project_id"]=project_template.id
            response_with_template_and_project["data"]=result_response_data
            return Response(response_with_template_and_project)
        except Exception as e:
            # return Response({"message":str(e)},status=400)
            return Response({"message":"Fill out all data and template id id needed"},status=400)


class ChatResponseView(APIView):

    active_listeners = set()  # Store active listeners
    def response_chat_stream(self,request,combined_context,user_init_wrk):

        user_id = request.id  # Unique identifier for the user
        try:
            if user_id:
                self.active_listeners.add(user_id)  # Add user to active listeners
        
            generated_content = []
            response = openai.ChatCompletion.create(
                model='gpt-3.5-turbo',
                messages=[
                    {'role': 'user', 'content': combined_context}
                ],
                temperature=0.6,
                stream=True
            )
            i=0
            for chunk in response:
                content = chunk["choices"][0]["delta"].get("content", "")
                finish_reason = chunk["choices"][0].get("finish_reason", "")
                i=i+1
                if(finish_reason!="stop"):
                    content = content.replace("\n","<br>")
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
                                user_id=request,
                                workspace=user_init_wrk.workspace_id,
                                token_generated=estimate_tokens_from_text(response_answer_from_openai)
                                )
                instance=ChatAPIContentModel.objects.create(
                    user_id=request,
                    workspace_id=user_init_wrk.workspace_id,
                    question=combined_context,
                    content=response_answer_from_openai
                )

                self.active_listeners.remove(user_id)


    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Api-Key', openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True, description='Your API Key')
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'question': openapi.Schema(type=openapi.TYPE_STRING,description="Ask Question To our JYRA AI "),
            }
        )
    )
    @log_request_user_with_api_key
    def post(self, request, user_instance):
        try:
            if len(request.data.get('question',''))<=0:
                return Response({"message":"question parameter missing"},status=400)
        except:
                return Response({"message":"question parameter missing"},status=400)

        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(user_instance)

        give_token_for_user=GenerateWordRestrictionForUser.objects.get(user=user_instance)
        give_token_for_user=give_token_for_user.words

        # check the status of trail start or ... from workshop
        user_status_init_wrk=InitialWorkShopOfUser.objects.get(user_filter=user_instance)

        # get the admin of workspace check user for premium template to use
        ins_check_trail_or_not=UserAccount.objects.get(id=user_status_init_wrk.owner_of_workspace.id)

        ins_sub=Subscription.objects.get(user_id=ins_check_trail_or_not)

        instance_user_generated_words=SingleUserTokenGenerated.objects.filter(user_id=user_instance).values("token_generated")
        total_token=0
        for user_data in instance_user_generated_words:
            total_token+=int(user_data["token_generated"])

        '''check for trail and active also '''
        # if ins_sub.status=="trial":
        if int(total_token)>=int(give_token_for_user):
            data_from_open_ai=[{"question":request.data.get('question'),"content":"Contact help support or upgrade your plan "}]
            return Response(data_from_open_ai,status=201)
        # if int(total_token)>=10
        

        if restrict_user_check is False:
            return JsonResponse(data, status=400)

        serializer = ChatApiContentSerializer(data=request.data)


        user_init_wrk=InitialWorkShopOfUser.objects.get(user_filter=user_instance)

        chat_answer = self.response_chat_stream(user_instance,request.data["question"],user_init_wrk)

        response =  StreamingHttpResponse(chat_answer,status=200, content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['Content-Disposition'] = 'attachment'

        '''
             uncomment this line  this on on nginx server configurations
        '''
        if settings.pro:
            response['Connection'] = 'keep-alive'
        return response
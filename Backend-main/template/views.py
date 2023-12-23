from rest_framework.decorators import api_view
from rest_framework.response import Response
from template.models import Template,Template_Field,Language,ProjectTemplate
from template.serializers import TemplateSerializer,Template_FieldSerializer,TemplateSelectedSerializer

import openai

from custome_template.models import CustomTemplate

from django.db.models import F

from concurrent.futures import ThreadPoolExecutor



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from template.open_api_request import makeAPIRequest
import base64
from template.models import TemplateAnswerModelOfUser
from template.times_convert import format_time_elapsed

from django.http import JsonResponse
from subscriptions.check_subscription import restrict_user,restrict_user_views

from django.db.models import Q
from django.apps import apps

@api_view(['GET'])
def TemplateDef(request):
    data = {"restrict_user": True}
    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)

    categories = request.GET.get('category')
    search_query = request.GET.get('search')
    templates = Template.objects.filter(active=True)

    # Apply category filter if categories are provided
    if categories and categories.lower() not in ["all", "all"]:
        categories_list = categories.split(",")  # Convert comma-separated values to a list
        category_filter = Q()
        for category_ in categories_list:
            tmp_id = Categorie.objects.get(category__icontains=category_)  # Use 'exact' for case-sensitive comparison
            category_filter |= Q(categories__id=tmp_id.id)
        templates = templates.filter(category_filter)

    # Apply search filter if search query is provided
    if search_query:
        model_fields = [field.name for field in Template._meta.get_fields() if field.concrete]
        search_filter = Q()
        model_fields.pop()
        for field in model_fields:
            if field.endswith("_id"):
                # Exclude ForeignKey fields from the search filter
                continue
            search_filter |= Q(**{f"{field}__icontains": search_query})
        templates = templates.filter(search_filter)

    serializer = TemplateSerializer(templates, many=True)
    sorted_data = sorted(serializer.data, key=lambda x: (not x['premium'], x['title'].lower()))

    # Remove duplicate data, if any
    unique_data = []
    unique_titles = set()
    for data in sorted_data:
        if data['title'] not in unique_titles:
            unique_data.append(data)
            unique_titles.add(data['title'])

    return Response(unique_data)


# single imp select category
@api_view(['GET'])
def ImpTemplate(request):
    query_data=Template.objects.filter(important=True)
    serializer = TemplateSerializer(query_data, many=True)
    return Response(serializer.data,200)


@api_view(['GET'])
def TemplateFieldDef(request):
    data = {"restrict_user": True}

    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)
    try:
        template_id = request.query_params.get('id')
        try:
            template_exists = Template.objects.filter(id=template_id).exists()
            templates = Template.objects.filter(id=template_id)
            serializer = TemplateSelectedSerializer(templates, many=True)

            try:
                template_fields = serializer.data[0].get('template_fields', [])
                sorted_template_fields = sorted(template_fields, key=lambda field: int(field['steps']))
                modified_data = list(serializer.data)
                modified_data[0]['template_fields'] = sorted_template_fields
                return Response(modified_data)
            except:
                return Response(serializer.data)
        except:
            return Response({"message":"id not exits"},status=400)
    except:
        return Response({"message":"id needed"},status=400)


from template.models import SingleUserTokenGenerated
from accounts.models import GenerateWordRestrictionForUser
from subscriptions.models import Subscription
from template.models import SingleUserTokenGenerated

from team_members.models import Workspace
from template.open_api_request import estimate_tokens_from_text


def check_text_match(text):
    match_data = None
    ins = Template.objects.filter(title=str(text)).values("what_to_generate")
    if not ins:
        custom_template_data = CustomTemplate.objects.filter(title=str(text)).values("what_to_generate")
        if custom_template_data and text == str(text):
            match_data = custom_template_data[0]["what_to_generate"]
        else:
            match_data = ""
    else:
        if text == str(text):
            match_data = ins[0]["what_to_generate"]
        else:
            match_data = ""
    return match_data


from team_members.models import InitialWorkShopOfUser


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def TemplateResponseOfTemplate(request):

    data = {"restrict_user": True}
    template_temp_id=request.data.get('ids',None)
    
    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)

    # generated token is more restrict user
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

    response_with_template_and_project={}

    if ins_sub.status=="trial":
        if int(total_token)>=int(give_token_for_user):
                response_with_template_and_project={
                    "project_id": "upgrade your plan",
                    "data": [
                        {
                        "role": "assistant",
                        "content": "upgrade your plan",
                        "created_at": "0 secs ago",
                        "length_of_content": 0
                        }
                    ]
                    }
                return Response(response_with_template_and_project)
        
        #template id to check trail user can use or not
        template_id__to_check = request.data.get("ids",None)
        check_template_premium_mode=Template.objects.get(id=template_id__to_check)
        if check_template_premium_mode.premium:
            response_with_template_premium_mode={
                    "project_id": "To use Premium you need to upgrade your plan",
                    "data": [
                        {
                        "role": "normal user",
                        "content": "To use Premium you need to upgrade your plan",
                        "created_at": "0 secs ago",
                        "length_of_content": 0
                        }
                    ]
                    }
            return Response(response_with_template_premium_mode)

    work_space=request.data.get("workspace_id",None)

    if work_space is None or work_space=="":
        return Response({'message':'workspace needed'},status=400)

    data = request.data
    tmp_output_results=data.get("output_results",None)
    check_generate_data=check_text_match(data.get("generate","default"))
    
    if tmp_output_results is None:
        tmp_output_results=2
    data.pop('output_results', None)
    data.pop('generate', None)
    # ask_question_to_gpt = ', '.join([f"{key}: {value}" for key, value in data.items()])

    result_response_data=[]
    template_answer_ids=[]
    template_id_ = request.data.get('ids',None)
    
    try:
        try:
            instance_of_template=Template.objects.get(id=template_id_)
        except:
            instance_of_template=CustomTemplate.objects.get(id=template_id_)
    except:
        # no id do nothing
        return Response({"message":"Template not found"},status=400)

    data.pop('ids',None)
    data.pop('workspace_id',None)
    ask_question_to_gpt = '\n'.join([f"{key}: {value}" for key, value in data.items()]) + '\n [ make it very unique ] '+ check_generate_data
    inst_wrk=Workspace.objects.get(id=work_space)


    # check the initial work-shop from url match or not
    user_init_wrk=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    if inst_wrk!=inst_wrk:
        return Response({"message":"something went wrong"},400)

    if int(tmp_output_results)>=11:
        tmp_output_results=2


    # count template used
    try:
        ins_template= Template.objects.get(id=template_temp_id)
    except:
        ins_template= CustomTemplate.objects.get(id=template_temp_id)
        ins_template=ins_template.template_taken_from

    # Create a ThreadPoolExecutor with a maximum of 3 worker threads (you can adjust this as needed)
    with ThreadPoolExecutor(max_workers=int(tmp_output_results)+1) as executor:
        # Submit the requests to the executor and store the futures using a for loop
        futures = []
        for id in range(1,int(tmp_output_results)+1):
            futures.append(executor.submit(makeAPIRequest, ask_question_to_gpt))
        # Retrieve and print the results using a for loop
        results = []
        for future in futures:
            results.append(future.result())

    for index,response_data_from_api in enumerate(results):
        # response_data_from_api=makeAPIRequest(ask_question_to_gpt)
        content = response_data_from_api["content"]
        length_of_content=len(content)
        response_data_from_api["length_of_content"]=length_of_content

        encoded_data = base64.b64encode(content.encode()).decode()
        instance = TemplateAnswerModelOfUser(user_id=request.user,workspace_id=inst_wrk,answer_response=encoded_data,template_id=instance_of_template.id)
        instance.save()

        instance_length = SingleUserTokenGenerated.objects.create(user_id=request.user,template_used=ins_template,workspace=inst_wrk,token_generated=estimate_tokens_from_text(content))

        template_answer_ids.append(instance)
        result_response_data.append(response_data_from_api)

    project_template = ProjectTemplate.objects.create(user_id=request.user)
    project_template.template_answer.set(template_answer_ids)
    response_with_template_and_project["project_id"]=project_template.id
    response_with_template_and_project["data"]=result_response_data
    return Response(response_with_template_and_project)


# def Languages(request):
#     query_set = Language.objects.all().values('language')
#     transformed_data = [{"value": item["language"], "label": item["language"]} for item in query_set]
#     return Response(transformed_data,status=200)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Languages(request):
    query_set = Language.objects.all().values('language')

    # Sort the queryset to have "English" language first
    query_set = sorted(query_set, key=lambda item: item["language"] != "English")

    transformed_data = [{"value": item["language"], "label": item["language"]} for item in query_set]
    return Response(transformed_data, status=200)

from template.models import GeneratedImageByuser


import requests
import os
import uuid

def download_images(img_urls, save_dir):
    downloaded_files = []

    for img_url in img_urls:
        try:
            # Generate a random filename with a unique UUID
            random_filename = str(uuid.uuid4()) + ".png"

            # Create the full path to save the image
            save_path = os.path.join(save_dir, random_filename)

            # Send a GET request to download the image
            response = requests.get(img_url)

            if response.status_code == 200:
                # Save the image to the specified directory with the random filename
                with open(save_path, 'wb') as f:
                    f.write(response.content)

                downloaded_files.append(random_filename)

            else:
                print(f"Failed to download image from {img_url}. Status code: {response.status_code}")

        except Exception as e:
            print(f"Error: {e}")

    return downloaded_files

from core.settings import BACK_END_HOST
from django.utils import timezone


import boto3
from botocore.exceptions import NoCredentialsError
from django.core.files.base import ContentFile
from core import settings

def upload_image_to_s3(image_data, s3_file_path):
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        # Upload the image directly from memory to S3
        s3.upload_fileobj(
            ContentFile(image_data),  # Convert image_data to a file-like object
            settings.AWS_STORAGE_BUCKET_NAME,
            s3_file_path
        )

        # Construct the S3 object URL
        s3_object_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{s3_file_path}"

        return s3_object_url
    except NoCredentialsError:
        return None


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def image_generator(request):
    
    # check the subscription plan
    wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    wrk_ins.workspace_id
    wrk_ins.owner_of_workspace

    # if trail then restrict image generated
    ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)
    
    if ins_subs.status == "trial":
        return Response({"message":"In Trail you cannot generate Image"},status=400)

    if ins_subs.status == "active":

        #  trail image generate for premium ( 200/month ) and starter ( 50/month )

        # Get the current date and time
        now = timezone.now()

        # Calculate the start of the current month and year
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

        # Filter the records for the current user and within the current month and year
        count = GeneratedImageByuser.objects.filter(
            user_id=request.user,
            created_at__gte=start_of_month,
            created_at__lt=now + timezone.timedelta(days=1)
        ).count()

        # restrict user for image generation

        if ins_subs.plan=="starter":
            if count>50:
                return Response({"message":"You cross the limit of generating image for starter 50/month"},status=400)
        if ins_subs.plan=="premium":
            if count>200:
                return Response({"message":"You cross the limit of generating image for premium 200/month"},status=400)

        if request.data.get('data', None) is not None:
            response = openai.Image.create(
                prompt=request.data.get('data', None),
                n=4,
                # size="1024x1024"
                size="512x512"
                # size="256x256"
            )
            img_urls = [item['url'] for item in response['data']]

            url_of_img_from_our_server = []
            try:
                if img_urls:
                    c = 0
                    for img_url in img_urls:
                        image_data = requests.get(img_url).content  # Download the image data
                        s3_file_path = f"images/{c}.jpg"
                        s3_object_url = upload_image_to_s3(image_data, s3_file_path)

                        if s3_object_url:
                            url_of_img_from_our_server.append(s3_object_url)
                            GeneratedImageByuser.objects.create(
                                img_url=s3_object_url,
                                our_server_image_name=s3_file_path,
                                user_id=request.user,
                                workspace_id=wrk_ins.workspace_id
                            )
                        c += 1
                else:
                    pass
            except Exception as e:
                return Response({"message": str(e)}, status=400)
            return Response({"image_urls": url_of_img_from_our_server}, status=200)
    return Response({"message": "You need to provide data to generate images."}, status=400)



import uuid

import pytube
from moviepy.editor import VideoFileClip
from template.models import GenerateAudioToSpeech,HowToSummarizeText
from template.open_api_request import summarize_text
import os

from template.times_convert import format_timedelta,format_time_elapsed,updated_time_format,format_time_month_day

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history_url(request):
    query_set = GenerateAudioToSpeech.objects.filter(user_id=request.user,url_of_video="url").values('id', 'summarize_text', 'created_at').order_by('-created_at')
    resp_query_set = []
    for item in query_set:
        decoded_item = {
            'id': item['id'],
            'created_at': format_time_elapsed(item['created_at']),
            'summarize_text': item["summarize_text"],
        }
        resp_query_set.append(decoded_item)
    return Response(resp_query_set, status=200)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history_audio_video(request):
    query_set = GenerateAudioToSpeech.objects.filter(user_id=request.user,url_of_video="audio_video").values('id', 'summarize_text', 'created_at').order_by('-created_at')
    resp_query_set = []
    for item in query_set:
        decoded_item = {
            'id': item['id'],
            'created_at': format_time_elapsed(item['created_at']),
            'summarize_text': item["summarize_text"],
        }
        resp_query_set.append(decoded_item)
    return Response(resp_query_set, status=200)






from datetime import datetime
from django.db.models import Sum



import os
from pytube import YouTube
import boto3
from botocore.exceptions import NoCredentialsError
import openai

# Initialize an S3 client
s3 = boto3.client('s3',
                  aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                  aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                  region_name=settings.AWS_S3_REGION_NAME)

# Initialize an S3 client
s3_client = boto3.client('s3',
                  aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                  aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                  region_name=settings.AWS_S3_REGION_NAME)

try:
    from template.models import OpenAiToken
    API_TOKEN=OpenAiToken.objects.get(id=1).token_generated
    # Initialize OpenAI
    openai.api_key = API_TOKEN # Replace with your OpenAI API key
except:
    pass

# Define the S3 bucket and directory where you want to store the video
s3_bucket = 'aiprojectfilestorage'
s3_directory = 'videos'

def upload_to_s3(local_path, s3_bucket, s3_directory):
    try:
        s3.upload_file(local_path, s3_bucket, f"{s3_directory}/{os.path.basename(local_path)}")
        s3_url = f"https://{s3_bucket}.s3-{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_directory}/{os.path.basename(local_path)}"
        return s3_url
    except NoCredentialsError:
        print("AWS credentials not available or invalid.")
        return None

from pytube import YouTube
from template.models import TempVideoDetails

def download_youtube_video(url, output_directory,id_of_video):
    try:

        unique_id = uuid.uuid4()
        uuid_str = str(unique_id)

        yt = YouTube(url)
        stream = yt.streams.get_audio_only()  # Get the highest resolution stream
        # video_filename = f"{yt.title}.mp3"  # Use the video title as the filename
        video_filename = f"{uuid_str}.mp3"  # Use the video title as the uuid
        
        instance_of_video=TempVideoDetails.objects.get(id=id_of_video)
        instance_of_video.directory_of_file="/tmp/"+str(video_filename)
        instance_of_video.save()

        # Download the video to the specified directory
        stream.download(output_path=output_directory, filename=video_filename)

        return os.path.join(output_directory, video_filename)
    except Exception as e:
        print(f"Error downloading YouTube video: {str(e)}")
        return None

def download_s3_object(s3_bucket_name, s3_object_key, local_file_path):
    try:
        s3_client.download_file(s3_bucket_name, s3_object_key, local_file_path)
        return True
    except Exception as e:
        print(f"Error downloading S3 object: {str(e)}")
        return False

from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_audio
from moviepy.editor import VideoFileClip


def transcribe_video_with_openai(s3_bucket_name, s3_object_key):
    try:
        # Download the S3 object to a local directory

        video_name = s3_object_key.split('/')[-1]
        local_video_path = f'/tmp/{video_name}'  # You can specify the local path

        # download_succeeded = download_s3_object(s3_bucket_name, s3_object_key, local_video_path)

        # Input video file path (replace with your file path)
        input_video_path = local_video_path

        # Output MP3 file path (choose a name for the output file)
        unique_id = uuid.uuid4()
        uuid_str = str(unique_id)
        output_audio_path = f'/tmp/{uuid_str}.mp3'

        # Load the video clip
        video_clip = VideoFileClip(input_video_path)

        # Extract audio from the video clip
        audio_clip = video_clip.audio

        # Write the audio clip to an MP3 file
        audio_clip.write_audiofile(output_audio_path, codec='mp3')

        # Close the video and audio clips
        video_clip.close()
        audio_clip.close()

        audio_file= open(output_audio_path, "rb")
        transcript = openai.Audio.transcribe("whisper-1", audio_file)

        # Remove the downloaded file after transcription
        # os.remove(local_video_path)
        # os.remove(output_audio_path)

        try:
            # Delete the object from the S3 bucket
            s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=s3_object_key)
        except Exception as e:
            pass
            print(f"Error deleting object: {str(e)}")
        return True
        # else:
        #     # ("Download failed.")
        #     return None
    except Exception as e:
        # (f"Error transcribing video: {str(e)}")
        return False


import urllib.parse
from urllib.parse import urlparse

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_video(request):

    if request.data.get('url', None) is not None:
        try:

            # Filter records based on the user_account field
            queryset = TempVideoDetails.objects.filter(user_account=request.user)

            # Delete all records in the queryset
            queryset.delete()
            

            wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
            wrk_ins.workspace_id
            wrk_ins.owner_of_workspace
            # if trail then restrict image generated
            ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)

            # Get the current date and time
            now = timezone.now()

            # Calculate the start of the current month and year
            start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

            # Filter the records for the current user and within the current month and year
            total_minutes = GenerateAudioToSpeech.objects.filter(
                user_id=request.user,
                created_at__gte=start_of_month,
                created_at__lt=now + timezone.timedelta(days=1)
            ).aggregate(total_minutes=Sum('minutes'))

            total_minutes_sum = total_minutes['total_minutes'] if total_minutes['total_minutes'] else 0

            # trail video 10 minutes
            if ins_subs.status == "trial":
                if total_minutes_sum>10:
                    return Response({"message": "Upgrade to premium"}, status=400)

            # premium ( 200 min/month ) and starter ( 50 min/month )
            if ins_subs.plan=="starter":
                if total_minutes_sum>50:
                    return Response({"message":"You cross the limit for starter 50 min/month"},status=400)
            if ins_subs.plan=="premium":
                if total_minutes_sum>200:
                    return Response({"message":"You cross the limit for premium 200 min/month"},status=400)

            # Send a GET request to the video URL
            youtube_url = request.data.get('url', None)

            # Create a YouTube object
            yt = pytube.YouTube(youtube_url)

            # Check the video's duration
            duration_seconds = yt.length

            # Convert to minutes
            duration_minutes = duration_seconds / 60
            if duration_minutes < 5:
                return Response({"message": "Video must be more than 5 minutes"}, status=400)
            if duration_minutes > 40:
                return Response({"message": "Video is too large maximum minutes is 40 minutes"}, status=400)

            # restrict trail to give duration-minutes more then 10
            if ins_subs.status == "trial":
                if duration_minutes>10:
                    return Response({"message": "For Trail 10 minutes only. Upgrade to premium"}, status=400)
            
            TempVideoDetails.objects.create(
                user_account=request.user,
                video_url=request.data.get('url', None),
                minutes=duration_minutes
            )
            return Response({"message": "Checking URL Video ...."}, status=200)
        except Exception as e:
            return Response({"message": str(e)}, status=400)
    return Response({"message": "You need to provide a valid URL."}, status=400)


from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def uploading_video(request):

    # Get the latest TempVideoDetails object for the current user
    latest_video_details = TempVideoDetails.objects.filter(user_account=request.user).order_by('-created_at').first()
    if latest_video_details.video_url:
        youtube_url = latest_video_details.video_url
        # Download the YouTube video
        downloaded_video_path = download_youtube_video(youtube_url, '/tmp',latest_video_details.id)
        if downloaded_video_path:
            return Response({"message": "Buckle Up for a While ...."}, status=200)
        else:
            print("Video download failed.")      
            return Response({"message": "You need to provide a valid URL failed"}, status=400)
    else:
        return Response({"message": "There was no latest video"}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def extracting_speech_from_video(request):
    # Get the latest TempVideoDetails object for the current user
    latest_video_details = TempVideoDetails.objects.filter(user_account=request.user).order_by('-created_at').first()
    if latest_video_details.directory_of_file:

        # save the scripts of video
        audio_file= open(latest_video_details.directory_of_file, "rb")
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
        
        instance_of_video=TempVideoDetails.objects.get(id=latest_video_details.id)
        instance_of_video.scripts_of_audio=str(transcript.text)
        instance_of_video.save()
        return Response({"message": "Text Extracted From Video"}, status=200)
    return Response({"message": "There was no latest video"}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getting_the_recap_of_audio(request):
    # Get the latest TempVideoDetails object for the current user
    latest_video_details = TempVideoDetails.objects.filter(user_account=request.user).order_by('-created_at').first()
    
    # Check if there is a latest video_details object
    if latest_video_details.scripts_of_audio:

        wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        how_to_summarize=HowToSummarizeText.objects.all().first()
        
        # it consume time for response
        resp_to_client=summarize_text("\n The text is \n"+latest_video_details.scripts_of_audio+"\n"+how_to_summarize.How_To_summarize)

        ins_of_speech=GenerateAudioToSpeech.objects.create(
            video_url=str(latest_video_details.video_url),
            user_id=request.user,
            url_of_video="url",
            text_from_audio=latest_video_details.scripts_of_audio,
            summarize_text=resp_to_client["content"],
            workspace_id=wrk_ins.workspace_id,
            minutes=latest_video_details.minutes
        )

        instance_of_video=TempVideoDetails.objects.get(id=latest_video_details.id)
        # Remove the downloaded file after transcription
        os.remove(instance_of_video.directory_of_file)
        instance_of_video.delete()

        
        # at last remove the audio which was generated
        # format_time_elapsed
        data = GenerateAudioToSpeech.objects.filter(id=ins_of_speech.id).values('id','summarize_text','created_at')
        query_set_modified = []
        response_data= {
            'id': data[0]['id'],
            'created_at': format_time_elapsed(data[0]['created_at']),
            'summarize_text': data[0]["summarize_text"],
        }
        query_set_modified.append(response_data)
        return Response(query_set_modified, status=200)

    return Response({"message": "Something went wrong !!"}, status=400)





import magic
from moviepy.editor import VideoFileClip
from pydub import AudioSegment
# Define the function to get audio duration
import subprocess
def get_audio_duration(video_path):
    try:
        result = subprocess.run(['ffprobe', '-i', video_path, '-show_entries', 'format=duration', '-v', 'error', '-of', 'default=noprint_wrappers=1:nokey=1'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        duration = float(result.stdout)
        return duration
    except Exception as e:
        print(f"Error getting audio duration: {e}")
        return 0



import os

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def file_first_step(request):
    try:
        file_chunk = request.data.get('file_chunk')
        file_name = request.data.get('file_name')
        file_size = int(request.data.get('file_size'))
        # Create a temporary directory if it doesn't exist
        # tmp_dir = os.path.join(, 'tmp')
        os.makedirs("/tmp", exist_ok=True)
        # Determine the file path for the chunk
        file_path = os.path.join("/tmp", file_name)

        # Append the chunk to the file
        with open(file_path, 'ab') as destination:
            destination.write(file_chunk.read())
        
        # check the size of file if it's matches then add to database
        file_path = f"/tmp/{file_name}"
        if os.path.exists(file_path):
            file_size_partial = os.path.getsize(file_path)
            if file_size_partial==file_size:

                audio_duration_seconds = get_audio_duration(file_path)
                audio_duration_minutes = audio_duration_seconds / 60

                wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
                wrk_ins.workspace_id
                wrk_ins.owner_of_workspace
                # if trail then restrict image generated
                ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)

                # Get the current date and time
                now = timezone.now()

                # Calculate the start of the current month and year
                start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

                # Filter the records for the current user and within the current month and year
                total_minutes = GenerateAudioToSpeech.objects.filter(
                    user_id=request.user,
                    created_at__gte=start_of_month,
                    created_at__lt=now + timezone.timedelta(days=1)
                ).aggregate(total_minutes=Sum('minutes'))

                total_minutes_sum = total_minutes['total_minutes'] if total_minutes['total_minutes'] else 0

                # trail video 10 minutes
                if ins_subs.status == "trial":
                    if total_minutes_sum>10:
                        os.remove(file_path)
                        return Response({"message": "Upgrade to premium"}, status=400)
                
                # premium ( 200 min/month ) and starter ( 50 min/month )
                if ins_subs.plan=="starter":
                    if total_minutes_sum>50:
                        os.remove(file_path)
                        return Response({"message":"You cross the limit for starter 50 min/month"},status=400)
                if ins_subs.plan=="premium":
                    if total_minutes_sum>200:
                        os.remove(file_path)
                        return Response({"message":"You cross the limit for premium 200 min/month"},status=400)

                if audio_duration_minutes < 5:
                    os.remove(file_path)
                    return Response({"message": "Audio must be more than 5 minutes."}, status=400)
                if audio_duration_minutes > 40:
                    os.remove(unique_save_path)
                    return Response({"message": "Audio is too large."}, status=400)
                
                # restrict trail to give duration-minutes more then 10
                if ins_subs.status == "trial":
                    os.remove(file_path)
                    if audio_duration_minutes>10:
                        return Response({"message": "For Trail 10 minutes only. Upgrade to premium"}, status=400)

                TempVideoDetails.objects.create(
                        user_account=request.user,
                        video_url=file_path,
                        directory_of_file=file_path,
                        minutes=audio_duration_minutes
                )

               # Filter records based on the user_account field and exclude specific file_path
                queryset = TempVideoDetails.objects.filter(user_account=request.user).exclude(directory_of_file=file_path)
                # Delete all previus records in the queryset
                queryset.delete()

        else:
            print(f"The file {file_path} does not exist.")

        return Response({"message":"File is ready buckle up now any time now ...","uploaded_partial_size":file_size_partial,"actual_size":file_size},status=200)
    except:
        return Response({"message":"Something went wrong"},status=400)


from moviepy.editor import VideoFileClip
import moviepy.editor as mp


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def convert_audio(request):
    # Get the latest TempVideoDetails object for the current user
    latest_video_details = TempVideoDetails.objects.filter(user_account=request.user).order_by('-created_at').first()
    if latest_video_details.directory_of_file:
        # save the scripts of video
        # Define the input video file path
        input_video_path = latest_video_details.directory_of_file


        try:
            # Check if the video file has an audio stream
            if video.audio is not None:
                # Load the input video file
                video = mp.VideoFileClip(input_video_path)
                # Extract the audio from the video file
                audio = video.audio
                # If the video file has an audio stream, check if it is already in MP3 format
                if video.audio.format != "mp3":
                    # Save the audio as an MP3 file
                    unique_id = uuid.uuid4()
                    uuid_str = str(unique_id)
                    audio.write_audiofile(f"{uuid_str}.mp3")
                    # If the video file is not already in MP3 format, convert it to MP3
                    video.audio.write_audiofile("output.mp3")
                return Response({"message":"Buckle up now ..."},status=200)
            else:
                # If the video file does not have an audio stream, raise an error
                return Response({"message":"Buckle up now ..."},status=200)
        except:
            return Response({"message":"Buckle up now ..."},status=200)
    return Response({"message":"Something went wrong"},status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie_file_to_text(request):

    if 'file' not in request.FILES:
        return Response({"message": "No file uploaded."}, status=400)

    try:
        # Get the uploaded file
        uploaded_file = request.FILES['file']
        
        unique_id = uuid.uuid4()
        uuid_str = str(unique_id)
        save_path = f"public/static/file"

        # Generate a unique filename using UUID and the original file's name
        original_filename = uploaded_file.name
        unique_filename = f"{uuid_str}_{original_filename}"
        unique_save_path = os.path.join(save_path, unique_filename)

        # Save the uploaded file with the unique filename
        with open(unique_save_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Check if the uploaded file is a video

        # if unique_filename.lower().endswith(('.mp4', '.avi', '.mkv', '.mov')):
        audio_duration_seconds = get_audio_duration(unique_save_path)
        audio_duration_minutes = audio_duration_seconds / 60


        wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        wrk_ins.workspace_id
        wrk_ins.owner_of_workspace
        # if trail then restrict image generated
        ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)


        # Get the current date and time
        now = timezone.now()

        # Calculate the start of the current month and year
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

        # Filter the records for the current user and within the current month and year
        total_minutes = GenerateAudioToSpeech.objects.filter(
            user_id=request.user,
            created_at__gte=start_of_month,
            created_at__lt=now + timezone.timedelta(days=1)
        ).aggregate(total_minutes=Sum('minutes'))

        total_minutes_sum = total_minutes['total_minutes'] if total_minutes['total_minutes'] else 0

        # trail video 10 minutes
        if ins_subs.status == "trial":
            if total_minutes_sum>10:
                return Response({"message": "Upgrade to premium"}, status=400)
        
        # premium ( 200 min/month ) and starter ( 50 min/month )
        if ins_subs.plan=="starter":
            if total_minutes_sum>50:
                return Response({"message":"You cross the limit for starter 50 min/month"},status=400)
        if ins_subs.plan=="premium":
            if total_minutes_sum>200:
                return Response({"message":"You cross the limit for premium 200 min/month"},status=400)

        if total_minutes_sum>10:
            return Response({"message": "Upgrade to premium"}, status=400)



        if audio_duration_minutes < 5:
            os.remove(unique_save_path)
            return Response({"message": "Audio must be more than 5 minutes."}, status=400)
        if audio_duration_minutes > 40:
            os.remove(unique_save_path)
            return Response({"message": "Audio is too large."}, status=400)
        
        # restrict trail to give duration-minutes more then 10
        if ins_subs.status == "trial":
            os.remove(unique_save_path)
            if audio_duration_minutes>10:
                return Response({"message": "For Trail 10 minutes only. Upgrade to premium"}, status=400)

        # else:
        # breakpoint()

        # Get the text from audio using openai
        audio_file = open(unique_save_path, "rb")
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
        # Request to openai API to summarize using chat
        how_to_summarize = HowToSummarizeText.objects.all().first()
        resp_to_client = summarize_text("\n The text is \n" + transcript.text + "\n" + how_to_summarize.How_To_summarize)

        # Create a record in the database
        ins_of_speech = GenerateAudioToSpeech.objects.create(
            user_id=request.user,
            text_from_audio=transcript.text,
            url_of_video="audio_video",
            summarize_text=resp_to_client["content"],
            workspace_id=wrk_ins.workspace_id,
            minutes=audio_duration_minutes
        )

        # Retrieve and format the information you want to return
        data = GenerateAudioToSpeech.objects.filter(id=ins_of_speech.id).values('id', 'summarize_text', 'created_at')
        os.remove(unique_save_path)
        query_set_modified = []
        response_data= {
            'id': data[0]['id'],
            'created_at': format_time_elapsed(data[0]['created_at']),
            'summarize_text': data[0]["summarize_text"],
        }
        query_set_modified.append(response_data)
        return Response(query_set_modified, status=200)
        # return Response(query_set, status=200)

        # else:
        #     os.remove(unique_save_path)
        #     return Response({"message": "The uploaded file is not a video."}, status=400)

    except Exception as e:
        os.remove(unique_save_path)
        return Response({"message": str(e)}, status=400)


from template.models import TempalteSelectFieldOptions
from brand_voice.models import Brandvoice
def capitalize_first_letter(s):
    if not s or not isinstance(s, str):
        return s

    return s[0].upper() + s[1:]


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def select_field_of_template(request):
    if request.method=="GET":
        query_set = TempalteSelectFieldOptions.objects.filter(user_id=request.user).values('value')
        res_data = [{"value": item["value"], "label": capitalize_first_letter(item["value"])} for item in query_set]
        query_set_brand = Brandvoice.objects.filter(user_id=request.user,trash=False).values('content_summarize','brand_voice')
        res_data = [{"value": item["content_summarize"], "label": capitalize_first_letter(item["brand_voice"])} for item in query_set_brand]
        return Response(res_data,status=200)
    if request.method=="POST":
        words_to_match = ["nice", "fancy", "relaxed", "skilled", "confident", "daring", "funny", "persuasive", "empathetic","Nice", "Fancy", "Relaxed", "Skilled", "Confident", "Daring", "Funny", "Persuasive", "Empathetic"]
        if request.data.get('value') in words_to_match:
            # matches
            query_set = TempalteSelectFieldOptions.objects.filter(user_id=request.user).values('value')
            res_data = [{"value": item["value"], "label": capitalize_first_letter(item["value"])} for item in query_set]
            return Response(res_data,status=200)
        else:
            if TempalteSelectFieldOptions.objects.filter(value=request.data["value"]).exists():
                query_set = TempalteSelectFieldOptions.objects.filter(user_id=request.user).values('value')
                res_data = [{"value": item["value"], "label":capitalize_first_letter( item["value"])} for item in query_set]
                return Response(res_data,status=200)
            query_set = TempalteSelectFieldOptions.objects.create(user_id=request.user,value=request.data.get("value"))
            return Response({"message":"created"},status=200)

from template.models import Categorie

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def categories(request):
    query_set = Categorie.objects.all().values('category')
    resp_data=[]
    for data in query_set:
        resp_data.append(data["category"])
    return Response(resp_data,status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def TemplateUserAnswer(request,id):
    data = {"restrict_user": True}
    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)
    
    work_space=request.GET.get("workspace_id",None)

    if work_space is None or work_space=="":
        return Response({'message':'workspace needed'},status=400)
    query_set = TemplateAnswerModelOfUser.objects.filter(user_id=request.user,workspace_id=work_space,template_id=id).values('id', 'user_id','template_id','answer_response', 'created_at').order_by('-created_at')
    decoded_query_set = []
    for item in query_set:
        decoded_item = {
            'id': item['id'],
            'user_id': item['user_id'],
            'created_at': format_time_elapsed(item['created_at']),
            'answer_response': base64.b64decode(item['answer_response']).decode(),
            'belongs_to_template_id': item['template_id']
        }
        decoded_query_set.append(decoded_item)
    
    return Response(decoded_query_set, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def single_response(request,data):
    data = {"restrict_user": True}
    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)
    res={}
    try:
        query_set=TemplateAnswerModelOfUser.objects.filter(id=data).values('id', 'user_id', 'answer_response', 'created_at')
    except ProjectTemplate.DoesNotExist:
        return Response({'error': 'template not found.'}, status=404)

    res["id"]=query_set[0]["id"]
    res["user_id"]=query_set[0]["user_id"]
    res["answer_response"]=base64.b64decode(query_set[0]["answer_response"]).decode()
    res["created_at"]=format_time_elapsed(query_set[0]["created_at"])
    return Response(res, status=200)

from template.serializers import ProjectTemplateSerializer

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def project_template(request,data):
    data = {"restrict_user": True}
    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)
    try:
        project_template = ProjectTemplate.objects.get(id=data)
    except ProjectTemplate.DoesNotExist:
        return Response({'error': 'Project template not found.'}, status=404)

    serializer = ProjectTemplateSerializer(project_template)
    return Response(serializer.data, status=200)

import json
def convert_newline_to_br(text):
    return text.replace('\n', '<br>')

@api_view(['GET'])
def test(request):
    
    # content = convert_newline_to_br(data['content'])

    content = {
    "time": 1690309967990,
    "blocks": [
        {
            "id": "sheNwCUP5A",
            "type": "paragraph",
            "data": {
                "text": "Product Name: Galaxy",
                "level": 2
            }
        }
    ]
    }

    return Response(content, status=200)
    # return Response({'content': 'this is cool<br>This is amazing<h1>wow this is good</h1><b>oop</b><p>okay i am good</p>'}, status=200)



from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UploadedImage
from .serializers import UploadedImageSerializer

@api_view(['POST'])
def upload_image(request):
    serializer = UploadedImageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)


from team_members.models import InitialWorkShopOfUser

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def favorite(request):
    if request.method=="POST":
        fav=request.data.get('fav')
        id=request.data.get('id')
        ins_workspace = InitialWorkShopOfUser.objects.get(user_filter=request.user)
        instance = Documents.objects.get(id=id,user_id=request.user,workspace_id=ins_workspace.workspace_id.id)
        instance.favorite=fav
        instance.save()
        return Response({"message":"added to favorite"}, status=201)
    if request.method=="GET":
        ins_workspace = InitialWorkShopOfUser.objects.get(user_filter=request.user)
        instance = Documents.objects.filter(user_id=request.user,workspace_id=ins_workspace.workspace_id.id,favorite=True).values("id","title")
        return Response(instance, status=200)
        

from custome_template.models import CustomTemplate

@api_view(['GET',"POST"])
@permission_classes([IsAuthenticated])
def count_custom_template(request):
    
    if request.method=="GET":
        count=0
        count=CustomTemplate.objects.filter(user_id=request.user).count()
        return Response({"cus_count":count}, status=200)



from collections import defaultdict
import calendar
from custome_template.models import CustomTemplate
from documentsData.models import Documents

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def token_generated(request):
    resp_data = []
    wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user).workspace_id
    queryset = SingleUserTokenGenerated.objects.filter(workspace=wrk_ins,user_id=request.user).values("id", "token_generated", "created_at", "updated_at")
    total_token=0
    for entry_ in queryset:
        total_token=int(total_token)+int(entry_["token_generated"])
    for entry in queryset:
        resp_data.append({
            "id": entry["id"],
            "name": entry["created_at"].strftime("%b"),
            "uv": total_token,
            "usage": entry["token_generated"],
            "amt": 0,
            "selected": False,
        })
    data = resp_data
    # Group the data by month
    data_by_month = defaultdict(list)
    for entry in data:
        month_name = entry["name"]
        data_by_month[month_name].append(entry)

    # Process the data and calculate the total "usage" for each month
    result_data = []
    id_counter = 1
    for month_num in range(1, 13):  # Loop through month numbers 1 to 12
        month_name = calendar.month_abbr[month_num]
        month_data = data_by_month.get(month_name, [])
        total_usage = sum(int(entry["usage"]) for entry in month_data) if month_data else 0
        result_data.append({
            "id": id_counter,
            "name": month_name,
            "Token_Generated": total_usage,
        })
        id_counter += 1
    resp_={}
    resp_["total"]=total_token
    resp_["data"]=result_data
    

    inst_template_custome = CustomTemplate.objects.filter(user_id=request.user).count()
    resp_["count_template"]=inst_template_custome
    
    inst_template_projects_no = Documents.objects.filter(user_id=request.user).count()
    resp_["projects_no"]=inst_template_projects_no

    return Response(resp_, status=200)


from team_members.models import InitialWorkShopOfUser

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_token_generated(request):
    resp_data = []
    wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user).workspace_id
    queryset = SingleUserTokenGenerated.objects.filter(workspace=wrk_ins).values("id", "token_generated", "created_at", "updated_at")
    total_token=0
    for entry_ in queryset:
        total_token=int(total_token)+int(entry_["token_generated"])
    for entry in queryset:
        resp_data.append({
            "id": entry["id"],
            "name": entry["created_at"].strftime("%b"),
            "uv": total_token,
            "usage": entry["token_generated"],
            "amt": 0,
            "selected": False,
        })
    data = resp_data
    # Group the data by month
    data_by_month = defaultdict(list)
    for entry in data:
        month_name = entry["name"]
        data_by_month[month_name].append(entry)

    # Process the data and calculate the total "usage" for each month
    result_data = []
    id_counter = 1
    for month_num in range(1, 13):  # Loop through month numbers 1 to 12
        month_name = calendar.month_abbr[month_num]
        month_data = data_by_month.get(month_name, [])
        total_usage = sum(int(entry["usage"]) for entry in month_data) if month_data else 0
        result_data.append({
            "id": id_counter,
            "name": month_name,
            "Token_Generated": total_usage,
        })
        id_counter += 1
    resp_={}
    resp_["total"]=total_token
    resp_["data"]=result_data
    

    inst_template_custome = CustomTemplate.objects.filter(user_id=request.user).count()
    resp_["count_template"]=inst_template_custome
    
    inst_template_projects_no = Documents.objects.filter(user_id=request.user).count()
    resp_["projects_no"]=inst_template_projects_no

    return Response(resp_, status=200)



from django.db.models import Sum
from collections import defaultdict


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def single_user_token_generation(request):

    wrk_ins = InitialWorkShopOfUser.objects.get(user_filter=request.user).workspace_id
    queryset = SingleUserTokenGenerated.objects.filter(workspace=wrk_ins, user_id=request.user).values("id", "template_used", "token_generated", "created_at", "updated_at")

    template_counts = defaultdict(set)
    total_generated = sum(int(item['token_generated']) for item in queryset)

    for item in queryset:
        template_counts[request.user.email].add(item['template_used'])

    full_name = f"{request.user.first_name} {request.user.last_name}"

    response_data = {
        "token_generated": total_generated,
        "name": full_name,
        "template_count": len(template_counts[request.user.email])
    }

    return Response([response_data], status=200)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_user_token_generation(request):
    from collections import defaultdict

    wrk_ins = InitialWorkShopOfUser.objects.get(user_filter=request.user).workspace_id
    queryset = SingleUserTokenGenerated.objects.filter(workspace=wrk_ins).values("id", "user_id__email", "template_used", "user_id__first_name", "user_id__last_name", "token_generated", "created_at", "updated_at")

    email_totals = defaultdict(int)
    template_counts = defaultdict(set)
    merged_data = []

    for item in queryset:
        email = item['user_id__email']
        email_totals[email] += int(item['token_generated'])
        template_counts[email].add(item['template_used'])

    for item in queryset:
        email = item['user_id__email']
        if item.get('user_id__last_name',None) is None:
            item['user_id__last_name']=""
        name = f"{item.get('user_id__first_name','')} {item.get('user_id__last_name','')}"

        if email_totals[email] > 0:
            merged_data.append({
                "id": item["id"],
                "user_id__email": email,
                "name": name,
                "token_generated": email_totals[email],
                "created_at": item["created_at"],
                "updated_at": item["updated_at"],
                "template_count": len(template_counts[email])
            })
            email_totals[email] = 0  # Set total to 0 to avoid duplicate entries

    return Response(merged_data, status=200)


from collections import Counter

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_template_user_user(request):
    wrk_ins = InitialWorkShopOfUser.objects.get(user_filter=request.user).workspace_id
    queryset = SingleUserTokenGenerated.objects.filter(workspace=wrk_ins, user_id=request.user).values("template_used")

    template_counter = defaultdict(int)

    for item in queryset:
        template_id = item['template_used']
        template_counter[template_id] = 1  # Treat each template as one occurrence

    total_occurrences = sum(template_counter.values())  # Calculate total occurrences

    response_data = {
        "total": total_occurrences,
        
    }

    return Response(response_data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_template_user_user(request):
    wrk_ins = InitialWorkShopOfUser.objects.get(user_filter=request.user).workspace_id
    queryset = SingleUserTokenGenerated.objects.filter(workspace=wrk_ins).values("template_used", "user_id__first_name", "user_id__last_name", "user_id__email")

    user_template_counts = defaultdict(int)
    processed_combinations = set()

    for item in queryset:
        email = item['user_id__email']
        template = item['template_used']
        combination = (email, template)

        if combination not in processed_combinations:
            user_template_counts[combination] += 1
            processed_combinations.add(combination)

    response_data = []

    for item in queryset:
        email = item['user_id__email']
        template = item['template_used']
        count = user_template_counts[(email, template)]

        # Check if the combination has already been added to the response data
        existing_entry = next((entry for entry in response_data if entry['template_used'] == template and entry['user_id__email'] == email), None)

        if existing_entry:
            existing_entry['count'] += count
        else:
            response_data.append({
                "template_used": template,
                "user_id__first_name": item['user_id__first_name'],
                "user_id__last_name": item['user_id__last_name'],
                "user_id__email": email,
                "count": count
            })
    result = []
    seen_users = set()

    for entry in response_data:
        user_key = (entry["user_id__email"], entry["user_id__first_name"], entry["user_id__last_name"])
        if user_key not in seen_users:
            seen_users.add(user_key)
            result.append({
                "user_id__email": entry["user_id__email"],
                "user_id__first_name": entry["user_id__first_name"],
                "user_id__last_name": entry.get("user_id__last_name",""),
                "template_used": [entry["template_used"]],
                "count": entry["count"]
            })
        else:
            for user_entry in result:
                if user_entry["user_id__email"] == entry["user_id__email"]:
                    user_entry["count"] += entry["count"]
                    user_entry["template_used"].append(entry["template_used"])
                    break
    for user_data in result:
        user_data["total_used"] = sum(user_data["template_used"].count(template_id) for template_id in user_data["template_used"])
    modified_result = []
    for user_data in result:
        modified_data = {
            "user_id__email": user_data["user_id__email"],
            "user_id__first_name": user_data["user_id__first_name"],
            "user_id__last_name": user_data.get("user_id__last_name",""),
            "template_used": user_data["template_used"],
            "count": user_data["total_used"]
        }
        modified_result.append(modified_data)
    # Calculate the total count
    total_count = sum(entry["count"] for entry in modified_result)

    # Create the new response data structure
    new_resp_data = {
        "data": modified_result,
        "total_count": total_count
    }
    return Response(new_resp_data, status=200)


from django.http import JsonResponse
from django.views import View
from .models import PerTokenGeneratedByOpenAI
from datetime import timedelta, datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from collections import defaultdict
from datetime import datetime

@api_view(['GET'])
def token_generated_by_users(request):
    queryset = PerTokenGeneratedByOpenAI.objects.all()

    # Create a defaultdict to store the sum of datepoints for each date
    datepoints_dict = defaultdict(int)

    for obj in queryset:
        date = obj.created_at.date()  # Extract the date portion
        datepoints_dict[date] += int(obj.token_generated)  # Sum up the token_generated values

    # Extract startdate and enddate from the request
    startdate_str = request.GET.get('startdate')
    enddate_str = request.GET.get('enddate')

    # Set default values for startdate_str and enddate_str
    if not startdate_str:
        today = datetime.now()
        start_date = today.replace(day=1)
        startdate_str = start_date.strftime('%Y-%m-%d')

    if not enddate_str:
        today = datetime.now()
        last_day = today.replace(day=28) + timedelta(days=4)
        end_date = last_day - timedelta(days=last_day.day)
        enddate_str = end_date.strftime('%Y-%m-%d')

    # Convert startdate and enddate strings to datetime objects
    start_date = datetime.strptime(startdate_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(enddate_str, '%Y-%m-%d').date()

    # Create a list of all dates within the given range
    date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]

    # Initialize new lists for missing dates and their corresponding values
    new_dates = []
    new_datepoints = []

    # Iterate through the date range and populate the new lists
    for date in date_range:
        new_date = date.strftime('%Y-%m-%d')
        new_dates.append(new_date)
        if date in datepoints_dict:
            new_datepoints.append(datepoints_dict[date])
        else:
            new_datepoints.append(0)

    data = {
        'dates': new_dates,
        'datepoints': new_datepoints,
    }
    return JsonResponse(data)


from template.models import SingleUserTokenGenerated
from accounts.models import UserAccount

@api_view(['GET'])
def token_generated_single_users(request):
    email = request.GET.get('email')
    
    user_ins=UserAccount.objects.get(email=email)
    queryset = SingleUserTokenGenerated.objects.filter(user_id=user_ins)

    # Create a defaultdict to store the sum of datepoints for each date
    datepoints_dict = defaultdict(int)

    for obj in queryset:
        date = obj.created_at.date()  # Extract the date portion
        datepoints_dict[date] += int(obj.token_generated)  # Sum up the token_generated values

    # Extract startdate and enddate from the request
    startdate_str = request.GET.get('startdate')
    enddate_str = request.GET.get('enddate')

    # Set default values for startdate_str and enddate_str
    if not startdate_str:
        today = datetime.now()
        start_date = today.replace(day=1)
        startdate_str = start_date.strftime('%Y-%m-%d')

    if not enddate_str:
        today = datetime.now()
        last_day = today.replace(day=28) + timedelta(days=4)
        end_date = last_day - timedelta(days=last_day.day)
        enddate_str = end_date.strftime('%Y-%m-%d')

    # Convert startdate and enddate strings to datetime objects
    start_date = datetime.strptime(startdate_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(enddate_str, '%Y-%m-%d').date()

    # Create a list of all dates within the given range
    date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]

    # Initialize new lists for missing dates and their corresponding values
    new_dates = []
    new_datepoints = []

    # Iterate through the date range and populate the new lists
    for date in date_range:
        new_date = date.strftime('%Y-%m-%d')
        new_dates.append(new_date)
        if date in datepoints_dict:
            new_datepoints.append(datepoints_dict[date])
        else:
            new_datepoints.append(0)

    data = {
        'dates': new_dates,
        'datepoints': new_datepoints,
    }
    return JsonResponse(data)


from template.models import TranscribeSpeechModal

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_transcribe_text_answer(request):
    try:
        if len(request.data.get('transcribe_data'))<=10:
            return Response({"message":"Provide a little details"},status=400)
        if len(request.data.get('transcribe_data'))>100:
            return Response({"message":"That huge slice it"},status=400)
    except:
        return Response({"message":"Provide a little details"},status=400)

    # check the subscription plan
    wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    wrk_ins.workspace_id
    wrk_ins.owner_of_workspace

    # if trail then restrict image generated
    ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)
    
    if ins_subs.status == "trial":
        return Response({"message":"In Trail you cannot use this feature"},status=400)

    if ins_subs.status == "active":
        language=request.data.get('transcribe_data',"English")
        tone=request.data.get('tone',"Professional")
        question_send_to_openai=request.data.get('transcribe_data')+" \n In Language :"+language+" \n In Tone : "+tone
        data = makeAPIRequest(question_send_to_openai)

        response_to_user=data.get('content','something went wrong')

        ins_transcribe=TranscribeSpeechModal.objects.create(
            user_account=request.user,
            workspace_id=wrk_ins.workspace_id,
            scripts_of_audio=request.data.get('transcribe_data'),
            answer_response=data.get('content','something went wrong')
        )


        query_set_modified = []
        response_data= {
            'id': ins_transcribe.id,
            'created_at': format_time_elapsed(ins_transcribe.created_at),
            'summarize_text': ins_transcribe.answer_response,
        }
        query_set_modified.append(response_data)
        return Response(query_set_modified, status=200)

        return Response(data,status=200)
    return Response({"message":"Provide a little details"},status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history_transcribe(request):
    query_set = TranscribeSpeechModal.objects.filter(user_account=request.user).values('id', 'answer_response', 'created_at').order_by('-created_at')
    resp_query_set = []
    for item in query_set:
        decoded_item = {
            'id': item['id'],
            'created_at': format_time_elapsed(item['created_at']),
            'summarize_text': item["answer_response"],
        }
        resp_query_set.append(decoded_item)
    return Response(resp_query_set, status=200)





import time
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from django.views.generic import View  
from django.shortcuts import render
from django.http import StreamingHttpResponse
from rest_framework import status


# class StreamGeneratorView(APIView):

#     def name_generator(self,fake):
#         response = openai.ChatCompletion.create(
#             model='gpt-3.5-turbo',
#             messages=[
#                 # {'role': 'user', 'content': "Write about cricket 100 words"}
#                 {'role': 'user', 'content': "Write a blog about  crickets"}
#             ],
#             temperature=0,
#             stream=True
#         )
#         i=0
#         for chunk in response:
#             time.sleep(0.01)
#             content = chunk["choices"][0]["delta"].get("content", "")
#             finish_reason = chunk["choices"][0].get("finish_reason", "")
#             i=i+1
#             if(finish_reason!="stop"):
#                 data = {"current_total": i, "content": content}
#                 yield data
#             else:
#                 data = {"current_total": i, "content": "@@"+finish_reason+"@@"}
#                 response.close()
#                 yield data
#             generated_content.append(content)


#     def get(self,request):
#         fake = Faker()
#         name = self.name_generator(fake)
#         # breakpoint()
#         response =  StreamingHttpResponse(name,status=200, content_type='text/event-stream')
#         response['Cache-Control']= 'no-cache',
#         return response


# Create your views here.

# class StreamGeneratorView(APIView):

#     def name_generator(self,fake):
#         name = fake.name()
#         while True:
#             for i in name:
#                 yield i
#             name = fake.name()

#     def get(self,request): 
#         fake = Faker()
#         name = self.name_generator(fake)
#         breakpoint()
#         response =  StreamingHttpResponse(name,status=200, content_type='text/event-stream')
#         response['Cache-Control']= 'no-cache',
#         return response
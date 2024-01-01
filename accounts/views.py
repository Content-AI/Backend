from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from django.http import JsonResponse
from accounts.models import Visitor
import requests
import json
import os
from dotenv import load_dotenv

import threading
from django.http import JsonResponse
from datetime import timedelta, datetime
from rest_framework.response import Response
from collections import defaultdict
from datetime import datetime

from accounts.models import UserFromHubSpot

from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework import viewsets
from accounts.models import UserAccount
from accounts.serializer import UserRegisterSerializer
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import parser_classes

from rest_framework.decorators import api_view
from django.views.decorators.csrf import  csrf_exempt
from accounts.generate_token import generate_token

from accounts.models import OTP_TOKEN
from django.core.mail import send_mail

import random
import math

from django.template.loader import render_to_string


from accounts.models import GeneralSetting,GenerateWordRestrictionForUser
from team_members.models import *
from accounts.serializer import GeneralSettingSerializer
from team_members.models import InitialWorkShopOfUser
from accounts.models import UserApiKey

from subscriptions.models import Subscription


# from accounts.get_user_details import get_user_subs_details

from core.settings import BACK_END_HOST
import concurrent.futures

load_dotenv()


from subscriptions.models import CountSubscribedUser,Subscription

import threading
import json
import logging

from datetime import datetime, timedelta
from django.utils import timezone
from accounts.register import send_hubspot_request
import stripe
# from subscriptions.views import get_price_id

from core.settings import get_price_id
from django_ratelimit.decorators import ratelimit
from accounts.models import UserFromHubSpot

import uuid
import hashlib


from core.settings import stripe_production

from accounts.register import send_otp_email

if stripe_production:
    stripe_key="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"
    stripe.api_key="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"
else:
    stripe_key = 'sk_test_51NZTCUD0PMGPSuj4SY0Mqqmuy1YkOHa4YFFlHFqaphXE6vdhcCJKtyqsKJ9Wzy10acbth3pUlb04HfzYB2ucvAGg00emcxaUJD'
    stripe.api_key = 'sk_test_51NZTCUD0PMGPSuj4SY0Mqqmuy1YkOHa4YFFlHFqaphXE6vdhcCJKtyqsKJ9Wzy10acbth3pUlb04HfzYB2ucvAGg00emcxaUJD'



def get_user_subs_details(url):
    response = requests.get(url)
    response_data = response.json()
    subscribed_user = CountSubscribedUser.objects.get(id=1)
    subscribed_user.total_user=response_data['subscribed_users_count']
    subscribed_user.save()
    logging.info(response_data)

import re

def is_valid_email(email):
    # Regular expression for a basic email validation
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    
    if re.match(pattern, email):
        return True
    else:
        return False

def is_domain_up(domain):
    try:
        response = requests.get(f"http://{domain}")
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException:
        return False

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@csrf_exempt
@api_view(['POST'])
@ratelimit(key='user', rate='3/4m', method='POST', block=True)  # Allow 8 requests per 3 minutes
def generate_otp_by_email(request):

    email =request.data.get('email')
    
    if email is None:
        return Response({"detail":"Email Required"},status=400)

    if is_valid_email(email) is False:
        return Response({"detail":"invalid email address"},status=400)
    match = re.search(r'@([^@]+)', email)

    '''
        Delete this if condition for email check 
        this is for 14 days trail to see the if it will be valid or not
    '''

    if match:
        pass
        domain = match.group(1)
        if is_domain_up(domain):
            pass
        else:
            return Response({"detail":"This type of email isn't accepted"},status=400)
    else:
        return Response({"detail":"Invalid email address"},status=400)


    digits = [i for i in range(0, 10)]
    random_str = ""
    for i in range(6):
        index = math.floor(random.random() * 10)
        random_str += str(digits[index])
    if email:
        user = UserAccount.objects.filter(email=email).first()
        if user:
            OTP_TOKEN.objects.create(user_id=user,otp_token=random_str)
        else:
            # crate user and also add the Workspace name
            email_name = email.split("@")[0]
            user=UserAccount.objects.create(email=email,first_name=email_name)
            GeneralSetting.objects.create(user_id=user)
            # create a Workspace every account create
            ins=Workspace.objects.create(workspace_name=email_name+" Workspace",admin_user_of_workspace=user,admin_or_not=True)


            # create api which can be use by premium acc
            # Generate a UUID
            uuid_value = uuid.uuid4()
            # Convert the UUID to bytes and hash it using MD5
            hash_object = hashlib.md5(uuid_value.bytes)
            # Get the hexadecimal digest (32 characters)
            hash_hex = hash_object.hexdigest()
            UserApiKey.objects.create(user=user,api_key=hash_hex[:25])

            try:
                # resp_of_hubspot=send_hubspot_request(user.email,email_name,"")
                # Create a thread for the request and processing
                thread = threading.Thread(target=send_hubspot_request, args=(user.email,email_name,""))
                thread.start()
                thread.join()
            except:
                pass


            TeamMemberList.objects.create(
                Workspace_Id=ins,
                admin_or_not=True,
                second_layer_admin_or_not=True,
                to_show_admin_user_email=user.email,
                workspace_name=ins.workspace_name,
                team_member_user=user,
                )
            ins_init=InitialWorkShopOfUser.objects.create(workspace_id=ins,user_filter=user,owner_of_workspace=user)
            GenerateWordRestrictionForUser.objects.create(user=user,words=2000)
            OTP_TOKEN.objects.create(user_id=user,otp_token=random_str)

            # Create a Stripe customer
            customer = stripe.Customer.create(
                email=user.email,
            )
            # Create a subscription with a 14-day trial period
            subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[
                    {
                        'price': get_price_id("premium","annually"),  # Replace with your actual price ID
                    },
                ],
                trial_period_days=14,
            )
            # start with 14 days trail for new user after register
            instance_subs = Subscription.objects.create(
                customer_stripe_id=customer.id,
                subscription_stripe_id=subscription.id,
                user_id=user,
                email=user.email,
                plan="premium",
                subscription_type="annually",
                status="trial",
                started_at= timezone.now(),
                restrict_user=False
            )


            trail_ends = instance_subs.started_at + timedelta(days=14)
            instance_update=Subscription.objects.get(id=instance_subs.id)
            instance_update.trail_ends=trail_ends
            instance_update.save()
            

        try:
            request_ip=get_client_ip(request)
            browser_details=str(request.META.get('HTTP_USER_AGENT'))
            thread = threading.Thread(target=send_otp_email, args=(email, random_str,browser_details, request_ip))
            thread.start()
            subject = 'Your One-Time Password'
            template_name = 'otp_email.html'
            try:
                name_for_email = user.first_name
            except:
                name_for_email=email_name
            context = {'otp': str(random_str),'name':str(name_for_email),'client_ip':str(get_client_ip(request)),'browser':str(request.META.get('HTTP_USER_AGENT'))}
            email_content = render_to_string(template_name, context)
            send_mail(
                subject,
                email_content,
                'test@gmail.com',
                [email],
                html_message=email_content,
                fail_silently=False
            )
        except Exception as e:
            print(str(e))
            pass
        return Response({"status":"registered new email","message":"check your email"}, status=status.HTTP_201_CREATED)
    return Response({"detail":"email needed"}, status=400)




from datetime import datetime
import pytz

@csrf_exempt
@api_view(['POST'])
@ratelimit(key='user', rate='3/6m', method='POST', block=True)  # Allow 8 requests per 3 minutes
def login_user_using_token(request):
    token =request.data.get('token')
    if token:
        user_id = OTP_TOKEN.objects.filter(otp_token=token).first()
        try:
            check_time__=OTP_TOKEN.objects.get(otp_token=token)
        except:
            return Response({"message":"not valid token"}, status=400)

        # Define the UTC timezone
        utc_timezone = pytz.utc

        # Define the current time with the UTC timezone
        current_time = datetime.now(utc_timezone)

        # Define the check_time timestamp and make it offset-aware
        check_time = check_time__.created_at

        # Calculate the time difference
        time_difference = current_time - check_time

        # Define the threshold for six minutes
        three_minutes = timedelta(minutes=3)

        # Check if six minutes have passed
        if time_difference >= three_minutes:
            # print("Six minutes have passed.")
            # block the user
            restriction = OTP_TOKEN.objects.get(otp_token=token)
            restriction.delete()
            return Response({"message":"token expires"}, status=400)
        else:
            if user_id:
                user = UserAccount.objects.filter(id=user_id.user_id_id).first()
                if user:
                    restriction = OTP_TOKEN.objects.get(otp_token=token)
                    token=generate_token(user)
                    restriction.delete()
                    return Response(token, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message":"not valid token"}, status=400)
    return Response({"message":"token needed"}, status=400)


@csrf_exempt
@api_view(['POST'])
def survey_data(request):
    # breakpoint()
    all_answer =request.data

    if request.user.id:
        first_answer = request.data.get('first_answer')
        second_answer = request.data.get('second_answer')
        third_answer = request.data.get('third_answer')
        question_answer_pairs = [
            {'question': '1. What best describes your role?', 'answer': first_answer},
            {'question': '2. How did you hear about our survey?', 'answer': second_answer},
            {'question': '3. Would you recommend our survey to others?', 'answer': third_answer},
        ]

        email_content = render_to_string('email_template.html', {'question_answer_pairs': question_answer_pairs})

        try:
            # Send the email
            # AMDIN_EMAIL
            recipient_emails = ["webcentralnepal@gmail.com"]
            AMDIN_EMAIL = "kcroshan682@gmail.com"
            send_mail(
                f'Question and Answer by {request.user.email}',
                '',
                'Survey person For Content Creation',
                [AMDIN_EMAIL]+recipient_emails,
                html_message=email_content
            )
            user_d=UserAccount.objects.get(email=request.user.email)
            user_d.three_steps=False
            user_d.save()
            pass
        except:
            pass
        
        return Response({"message":"Thank you for participation"}, status=200)
    return Response({"message":"Not Authorize"}, status=401)


class RegisterView(viewsets.ViewSet):
    def create(self,request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Data created'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None
    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].data.get('refresh')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid token found in cookie \'refresh_token\'')

# from .serializers import MyTokenObtainPairSerializer
from accounts.serializer import MyTokenObtainPairSerializer
from rest_framework.renderers import JSONRenderer


class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def finalize_response(self, request, response, *args, **kwargs):
        try:
            user = UserAccount.objects.get(email=self.request.data.get('email'))
            response.data["three_steps"]=user.three_steps
            return super().finalize_response(request, response, *args, **kwargs)
        except:
            pass
        response = Response({"message": "check credentials"})
        response.accepted_renderer = JSONRenderer()
        response.accepted_media_type = "application/json"
        response.renderer_context = {}
        return response
        
class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        return super().finalize_response(request, response, *args, **kwargs)
    serializer_class = CookieTokenRefreshSerializer




from .serializer import GoogleSocialAuthSerializer,FacebookSocialAuthSerializer
from rest_framework.generics import GenericAPIView
from rest_framework import status

class GoogleSocialAuthView(GenericAPIView):
    serializer_class = GoogleSocialAuthSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['auth_token'])
        return Response(data, status=status.HTTP_200_OK)



class FacebookSocialAuthView(GenericAPIView):

    serializer_class = FacebookSocialAuthSerializer

    def post(self, request):
        """
        POST with "auth_token"
        Send an access token as from facebook to get user information
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['auth_token'])
        return Response(data, status=status.HTTP_200_OK)



# ==========General settings=======

class GeneralSettingViewSet(viewsets.ViewSet):
    permission_classes=[IsAuthenticated]

    def list(self,request):
        instance = GeneralSetting.objects.filter(user_id=request.user)
        serializer = GeneralSettingSerializer(instance,many=True)
        return Response(serializer.data)

    def partial_update(self,request,pk):
        id = pk
        instance = GeneralSetting.objects.get(pk=id)
        serializer = GeneralSettingSerializer(instance,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'data updated'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from accounts.serializer import UserCreateSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])

def users_data(request):
    # ====call a function=====
    # Set up logging
    # logging.basicConfig(level=logging.INFO)

    # Replace with the actual URL to call
    # url_to_call = f'{BACK_END_HOST}/v1/subscription/get_total_subscribers'

    # Start a new thread to run get_user_subs_details in the background
    # background_thread = threading.Thread(target=get_user_subs_details, args=(url_to_call,))
    # background_thread.start()

    # ====call a function=====

    user_data=UserAccount.objects.get(id=request.user.id)
    serializer = UserCreateSerializer(user_data)
    return Response([serializer.data],status=200)
    



from core.settings import FRONT_END_LINKEDIN,FRONT_END_GOOGLE
from core.settings import client_id,client_secret
from core.settings import client_id_google,client_secret_google

from accounts.register import register_social_user

@api_view(['GET','POST'])
def google_update(request):
    
    # Replace with your Google OAuth 2.0 client ID and secret
    client_id = client_id_google
    client_secret = client_secret_google

    # Replace with your actual frontend URL (Redirect URI)
    redirect_uri = FRONT_END_GOOGLE
    # The authorization code obtained after the user grants permission
    authorization_code = request.data.get("code_google")
      
    # Userinfo endpoint URL
    userinfo_endpoint = f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={authorization_code}'

    # Make the GET request to userinfo endpoint
    response = requests.get(userinfo_endpoint)
    if response.status_code == 200:
        try:
            data = response.json()
            name=data.get("given_name","")
            given_name=data.get("given_name","")
            family_name=data.get("family_name","")
            email=data.get("email",None)
            provider="email"
            user_id=None
            resp=register_social_user(provider, user_id, email, name, given_name, family_name)
            return Response(resp,status=200)
        except Exception as e:
            return Response({"message":str(e)},status=400)
    else:
        return Response({"message":"something went wrong else"},status=400)
    return Response({"message":"good"},status=200)

@api_view(['GET','POST'])
def linkedin(request):
    code = request.data.get('code',None)
    # Replace with your actual access token
    access_token = code

    authorization_code = code
    client_id = '86nbyoaj3py59q'
    client_secret = 'NQtw9gMCj4zOIUWX'
    redirect_uri = FRONT_END_LINKEDIN

    token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {
        'grant_type': 'authorization_code',
        'code': authorization_code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri
    }

    response = requests.post(token_url, headers=headers, data=data)

    access_token = response.json().get('access_token')

    # ==== make another request to get user info ====
    profile_url = 'https://api.linkedin.com/v2/userinfo'
    headers_ = {
        'Authorization': f'Bearer {access_token}'
    }

    response__ = requests.get(profile_url, headers=headers_)
    if response__.status_code == 200:
        data=response__.json()
        if data.get("email_verified",None):
            try:
                given_name=data.get("given_name","")
                name=data.get("given_name","")
                family_name=data.get("family_name","")
                email=data.get("email",None)
                provider="email"
                user_id=None
                resp=register_social_user(provider, user_id, email, name, given_name, family_name)
                return Response(resp,status=200)
            except Exception as e:
                return Response({"message":str(e)},status=400)
        else:
            return Response({"message":"Verify you LinkedIn Email"},status=400)
    else:
        return Response({"message":"something went wrong"},status=400)
    return Response({"message":"good"},status=200)
    
    



@api_view(['GET'])
def total_account(request):
    ins=UserAccount.objects.all().count()
    return Response({"users_count":ins},200)


from core.settings import HUBSPOT_API_KEY_TICKETS


def function_create_ticket_in_hubspot(data):
    try:
        ins_user = UserFromHubSpot.objects.get(email=data.user.email)
        ticket_hubspot_url="https://api.hubapi.com/crm/v3/objects/tickets"
        payload = json.dumps({
        "properties": {
            "hs_pipeline": "0",
            "hs_pipeline_stage": "1",
            "hs_ticket_priority": "HIGH",
            "subject": data.data.get('subject',None),
            "content": data.data.get('content',None)
        },
        "associations": [
            {
            "to": {
                "id": ins_user.hubspot_user_id
            },
            "types": [
                {
                "associationCategory": "HUBSPOT_DEFINED",
                "associationTypeId": 16
                }
            ]
            }
        ]
        })
        headers = {
        'Authorization': f'Bearer {HUBSPOT_API_KEY_TICKETS}',
        'Content-Type': 'application/json'
        }
        response = requests.request("POST", ticket_hubspot_url, headers=headers, data=payload)
        return True
    except Exception as e:
        print(str(e))
        return False



from hubspot_data.models import TicketIssue

@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def create_tickets(request):
    if request.method=="POST":
        if TicketIssue.objects.filter(issues=request.data.get('subject',None)).exists():
            if request.data.get('subject',None) is None or len(request.data.get('subject',None))>=500 or len(request.data.get('subject',None))<=1:
                return Response({"message": "subject is required with less then 500 word"},400)

            if request.data.get('content',None) is None or len(request.data.get('content',None))>=500 or len(request.data.get('content',None))<=1:
                return Response({"message": "content is required with less then 500 word"},400)        
            hub_api=function_create_ticket_in_hubspot(request)
            if hub_api:
                return Response({"message": "We will get back soon"},200)
            else:
                return Response({"message": "There is some problem please try again later"},400)
        else:
            return Response({"message": "Raise a valid Subject"},400)

    if request.method=="GET":
        issues_list = [item[0] for item in TicketIssue.objects.all().values_list('issues')]
        return Response(issues_list,200)


from subscriptions.models import EnterprisePlanList,MonthlyPlanList,YearlyPlanList
from accounts.models import UserFromHubSpot

@api_view(['GET'])
def why_subscribe(request):

    if request.method=="GET":
        if request.GET.get('why_subs')=="enterprise":
            list_why_subs = [item[0] for item in EnterprisePlanList.objects.all().values_list('point')]
            return Response(list_why_subs,200)
        
        if  request.GET.get('why_subs')=="yearly":
            list_why_subs = [item[0] for item in YearlyPlanList.objects.all().values_list('point')]
            return Response(list_why_subs,200)

        if  request.GET.get('why_subs')=="monthly":
            list_why_subs = [item[0] for item in MonthlyPlanList.objects.all().values_list('point')]
            return Response(list_why_subs,200)
        return Response({"message":"oops"},400)
        





@api_view(['GET'])
def track_visitor(request):
    try:
        ip_address = request.META.get('HTTP_X_REAL_IP')
        user_agent = request.META.get('HTTP_USER_AGENT')
        # ip_address="149.56.150.236"
        response = requests.get(f"http://ipinfo.io/{ip_address}/json")
        if response.status_code == 200:
            data = json.loads(response.content)
            country = data.get("country", "Unknown")
            data_lon_lat = response.json()
            location = data_lon_lat.get('loc', '').split(',')  # 'loc' contains "latitude,longitude"
            latitude = location[0]
            longitude = location[1]
            city=data_lon_lat["city"]
            region=data_lon_lat["region"]
        else:
            country = "Unknown"
            latitude = ""
            longitude = ""
        Visitor.objects.create(ip_address=ip_address,country=country,city=city,region=region,latitude=latitude,longitude=longitude,user_agent=user_agent,count=1)
    except:
        pass
    return Response({"pings": "0.0.0.0"},200)







@api_view(['GET'])
def visitor_data(request):
    queryset = Visitor.objects.all()

    # Create a defaultdict to store the sum of datepoints for each date
    datepoints_dict = defaultdict(int)

    for obj in queryset:
        date = obj.created_at.date()  # Extract the date portion
        datepoints_dict[date] += int(obj.count)  # Sum up the token_generated values

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
    
    # breakpoint()

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



# views.py
from django.http import JsonResponse
from django.db.models import F, Sum
from django.views import View
from accounts.models import Visitor

class VisitorDataApiView(View):
    def get(self, request):
        # Fetch visitor data and consolidate counts for similar coordinates
        visitors = Visitor.objects.values('country', 'latitude', 'longitude', 'city', 'region').annotate(count_sum=Sum('count'))

        # Prepare the consolidated data
        consolidated_data = []
        processed_coordinates = set()
        
        for visitor in visitors:
            latitude = float(visitor['latitude'])
            longitude = float(visitor['longitude'])
            coordinates = (latitude, longitude)
            
            if coordinates not in processed_coordinates:
                consolidated_data.append({
                    'country': visitor['country'],
                    'latitude': latitude,
                    'longitude': longitude,
                    'count': visitor['count_sum'],
                    'city': visitor['city'],
                    'region': visitor['region'],
                })
                processed_coordinates.add(coordinates)

        return JsonResponse(consolidated_data, safe=False)



from rest_framework.views import APIView
from accounts.models import Visitor
from collections import defaultdict

from accounts.country import country_names

class AggregatedVisitorStats(APIView):
    def get(self, request, format=None):
        visitors = Visitor.objects.all()

        country_visitors = defaultdict(int)
        for visitor in visitors:
            country_visitors[visitor.country] += int(visitor.count)

        # Sort the aggregated data by count in descending order
        aggregated_data = sorted(
            [{'country': country_names.get(country, country), 'count': count} for country, count in country_visitors.items()],
            key=lambda x: x['count'],
            reverse=True  # Sort in descending order
        )

        return Response(aggregated_data)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_api_key(request):
    wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)
    if ins_subs.status == "active" and ins_subs.plan == "premium":
        api_key = UserApiKey.objects.get(user=ins_subs.user_id)
        return Response({"api_key":api_key.api_key},status=200)
    else:
        return Response({"message":"upgrade your plan"},status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_new_api_key(request):
    wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)
    if ins_subs.status == "active" and ins_subs.plan == "premium":
        del_ins=UserApiKey.objects.filter(user=request.user).delete()
        uuid_value = uuid.uuid4()
        hash_object = hashlib.md5(uuid_value.bytes)
        hash_hex = hash_object.hexdigest()
        UserApiKey.objects.create(user=request.user,api_key=hash_hex[:25])
        api_key = UserApiKey.objects.get(user=ins_subs.user_id)
        return Response({"api_key":api_key.api_key},status=200)
    else:
        return Response({"message":"upgrade your plan"},status=400)




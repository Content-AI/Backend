import random
from accounts.models import UserAccount
from password_generator import PasswordGenerator
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

# from django.core.mail import send_mail
from accounts.models import UserFromHubSpot
from accounts.models import GeneralSetting

from datetime import timezone, datetime
from datetime import timedelta
import threading


import uuid
import hashlib

from accounts.models import UserApiKey

from team_members.models import Workspace,TeamMemberList

from django.contrib.auth import get_user_model
from accounts.generate_token import generate_token
from accounts.models import GenerateWordRestrictionForUser

from team_members.models import InitialWorkShopOfUser
from subscriptions.models import Subscription

def generate_username(name):

    username = "".join(name.split(' ')).lower()
    if not UserAccount.objects.filter(username=username).exists():
        return username
    else:
        random_username = username + str(random.randint(0, 1000))
        return generate_username(random_username)


import requests
import threading
import json
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
import random
import threading


from core.settings import HUBSPOT_API_KEY

# Function to send the API request
def send_hubspot_request(email,first_name,last_name):
    url = "https://api.hubapi.com/crm/v3/objects/contacts"
    headers = {
        "Authorization": f"Bearer {HUBSPOT_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "properties": {
            "email": email,
            "firstname": first_name,
            "lastname": last_name,
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Check for errors in the response
        data = json.loads(response.text)
        # Extract the 'id' and 'email' values from hubspot api response
        id_value = data.get('id',None)
        email_value = data.get("properties",None).get('email',None)
        ins=UserFromHubSpot.objects.create(
            email=email_value,
            hubspot_user_id=id_value,
        )
    except Exception as e:
        print(f"HubSpot request failed: {str(e)}")



def send_otp_email(email, random_str,browser_details, request_ip, email_name=None):
    try:
        subject = 'Your One-Time Password'
        template_name = 'otp_email.html'
        try:
            name_for_email = user.first_name
        except:
            name_for_email = email_name
        context = {
            'otp': str(random_str),
            'name': str(name_for_email),
            'client_ip': str(request_ip),
            'browser': browser_details
        }
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







import stripe
from subscriptions.views import get_price_id
from core.settings import STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY

stripe_key = STRIPE_SECRET_KEY
stripe.api_key = STRIPE_SECRET_KEY



def register_social_user(provider, user_id, email, name, given_name, family_name):
    filtered_user_by_email = UserAccount.objects.filter(email=email)
    pwo = PasswordGenerator()

    # user =  UserAccount.objects.filter(email=email).delete()
    if filtered_user_by_email.exists():
        # if provider == filtered_user_by_email[0].auth_provider:
        user = UserAccount.objects.filter(email=email).first()

        token = generate_token(user)
        return token

        # else:
        #     raise AuthenticationFailed(
        #         detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

    else:
        strong_pasword_is_myth = str(pwo.generate())        
        user = {'first_name': given_name,'three_steps':False,'last_name': family_name, 'email': email, 'password': strong_pasword_is_myth}
        user = UserAccount.objects.create_user(**user)
        GeneralSetting.objects.create(user_id=user)
        user.is_verified = True
        user.auth_provider = provider
        user.save()

        ins=Workspace.objects.create(workspace_name=given_name+" Workspace",admin_user_of_workspace=user,admin_or_not=True)


        # create api which can be use by premium acc
        # Generate a UUID
        uuid_value = uuid.uuid4()

        # Convert the UUID to bytes and hash it using MD5
        hash_object = hashlib.md5(uuid_value.bytes)

        # Get the hexadecimal digest (32 characters)
        hash_hex = hash_object.hexdigest()
        UserApiKey.objects.create(user=user,api_key=hash_hex[:25])
        
        # send_hubspot_request(email,given_name,family_name)

        try:
            # resp_of_hubspot=send_hubspot_request(user.email,email_name,"")
            # Create a thread for the request and processing
            thread = threading.Thread(target=send_hubspot_request, args=(user.email,email_name,""))
            thread.start()
            thread.join()
            # resp_of_hubspot=send_hubspot_request(email,given_name,family_name)
            # data = json.loads(resp_of_hubspot.text)
            # # Extract the 'id' and 'email' values from hubspot api response
            # id_value = data.get('id',None)
            # email_value = data.get("properties",None).get('email',None)
            # UserFromHubSpot.objects.create(
            #     email=email_value,
            #     hubspot_user_id=id_value,
            # )
        except:
            pass

        TeamMemberList.objects.create(
                Workspace_Id=ins,
                admin_or_not=True,
                second_layer_admin_or_not=True,
                workspace_name=ins.workspace_name,
                to_show_admin_user_email=user.email,
                team_member_user=user,
                )
        ins_init=InitialWorkShopOfUser.objects.create(workspace_id=ins,user_filter=user,owner_of_workspace=user)
        GenerateWordRestrictionForUser.objects.create(user=user,words=2000)
        user = UserAccount.objects.filter(email=email).first()
        token = generate_token(user)
        token["three_steps"]=user.three_steps

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
            started_at= datetime.now(timezone.utc),
            restrict_user=False
        )


        trail_ends = instance_subs.started_at + timedelta(days=14)
        instance_update=Subscription.objects.get(id=instance_subs.id)
        instance_update.trail_ends=trail_ends
        instance_update.save()



        return token

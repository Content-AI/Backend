import os
from dotenv import load_dotenv
from accounts.register import register_social_user

from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
User = get_user_model()
from . import google
from rest_framework import serializers
from accounts.models import UserAccount

load_dotenv()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        # fields = ('id', 'email', 'first','last','profile_pic')
        fields = '__all__'

class UserRegisterSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields="__all__"
        # fields = ('id', 'email','username','first_name','last_name','password')



class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = google.Google.validate(auth_token)
        try:
            user_data.get('sub')
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please login again.'
            )
        # breakpoint()

        # GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
        GOOGLE_CLIENT_ID = "65857693177-41t814nhrml22jptcfdrcqveumamp8al.apps.googleusercontent.com"
        if user_data.get('aud') != GOOGLE_CLIENT_ID:
            raise serializers.ValidationError(
                'you aren\'t login from our site'
            )
            # return {"message": "you aren't login from our site"}
        try:
            user_id = user_data.get('sub',None)
            email = user_data.get('email',None)
            name = user_data.get('name',None)
            given_name = user_data.get('given_name',None)
            provider = 'email'
            family_name = user_data.get('family_name',None)
            # picture = user_data["picture"]
        except:
            return {"message": "user data not found"}
        if user_data.get('email',None)== "admin@gmail.com" or user_data.get('email',None)=="webcentralnepal@gmail.com":
            return {"message":"admin cannot login sorry"}
        if user_data['email_verified'] is not True:
            return {"message": "email not verified"}
        # return register_social_user(provider=provider, user_id=user_id, email=email, name=name,given_name=given_name,family_name=family_name,picture=picture)
        return register_social_user(provider=provider, user_id=user_id, email=email, name=name, given_name=given_name, family_name=family_name)




from . import facebook

class FacebookSocialAuthSerializer(serializers.Serializer):
    """Handles serialization of facebook related data"""
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = facebook.Facebook.validate(auth_token)
        try:
            user_id = user_data.get('id')
            email = user_data.get('email')
            name = user_data.get('name')
            given_name = user_data.get('name')
            family_name = user_data.get('last_name')
            provider = 'email'
            return register_social_user(
                provider=provider,
                user_id=user_id,
                email=email,
                name=name,
                given_name=given_name,
                family_name=family_name,
            )
        except Exception as identifier:

            raise serializers.ValidationError(
                'The token  is invalid or expired. Please login again.'
            )



import time
import datetime
# =====================Login token genreated===================================
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff
        return token

# =============================================================================

class Obtain_Refresh_And_Access(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff
        return token







# =========general settings==========
from accounts.models import GeneralSetting

class GeneralSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralSetting
        fields = "__all__"




class VisitorGroupedSerializer(serializers.Serializer):
    country = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    city = serializers.CharField()
    region = serializers.CharField()
    count = serializers.IntegerField()


from rest_framework import serializers
from .models import Visitor

class VisitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visitor
        fields = ('country', 'count')

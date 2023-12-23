from rest_framework import serializers
from chat.models import ChatRootModel,ChatContentModel
from accounts.models import UserAccount
from django.core.validators import MinLengthValidator
from collections import OrderedDict

import openai
from template.open_api_request import makechatrequest
import base64

class ChatRootModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRootModel
        fields = ["id","title"]
    def validate(self,data):
        data["user_id"]=self.context["user"].user
        return data

from .models import ChatContentModel

class ChatContentGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatContentModel
        fields = ['id', 'root', 'question', 'content']

class ChatRootGetModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRootModel
        fields = ['id', 'title']
    
    def to_representation(self,data):
        representation = super().to_representation(data)
        representation["chat_data"]=ChatContentGetSerializer(data.chat_root_relation.all(),many=True).data
        return representation

class ChatContentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatContentModel
        # fields = "__all__"
        fields = ['chat_root', 'question']



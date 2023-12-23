from chat_template.models import ChatFirstTemplateModel,ChatSecondStepTemplateModel,ChatThirdValueOfTemplateModel,CustomeChatTemplateOfUser
from template.open_api_request import summarize_in_tone
import base64

from rest_framework import serializers
from rest_framework.exceptions import ValidationError



class ChatTemplateModelGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatFirstTemplateModel
        fields = "__all__"

class ChatSecondStepTemplateModelGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSecondStepTemplateModel
        fields = "__all__"

class ChatFirstTemplateNestedModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatFirstTemplateModel
        fields = "__all__"
    
    def to_representation(self,data):
        representation = super().to_representation(data)
        representation["second_title"]=ChatSecondStepTemplateModelGetSerializer(data.chat_template_model_id.all(),many=True).data
        return representation

class ChatThirdValueOfTemplateModelGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatThirdValueOfTemplateModel
        fields = "__all__"

class ChatSecondStepTemplateNestedModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSecondStepTemplateModel
        fields = "__all__"
    
    def to_representation(self,data):
        representation = super().to_representation(data)
        representation["inner_value_data"]=ChatThirdValueOfTemplateModelGetSerializer(data.chat_first_step_template_id.all(),many=True).data
        return representation



class ChatCustomeTemplateModelGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomeChatTemplateOfUser
        fields = ["id","title","description","trash"]

class ChatTemplateModelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomeChatTemplateOfUser
        fields = ["id","title","description","trash"]

    def validate(self,data):
        data["user_id"]=self.context["user"].user
        return data
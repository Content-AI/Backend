from brand_voice.models import Brandvoice
from template.open_api_request import summarize_in_tone
import base64

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

class BrandVoiceGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brandvoice
        fields = ["id","brand_voice","content_summarize","trash"]

class BrandVoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brandvoice
        fields = ["brand_voice","content"]

    def validate(self,data):
        data["user_id"]=self.context["user"].user
        content_length = len(data.get("content",""))
        brand_voice_length = len(data.get("brand_voice",""))
        if content_length < 5:
            raise ValidationError("Content length must be at least 5 characters.")
        if brand_voice_length < 2:
            raise ValidationError("brand voice length must be at least 5 characters.")
        if brand_voice_length > 40:
            raise ValidationError("brand voice max 20 character.")
        data["content"]=data.get('content')
        data["content_summarize"]=summarize_in_tone(data.get("content",""))
        data["brand_voice"]=data.get("brand_voice","")
        return data



class BrandVoicePatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brandvoice
        fields = ["id","brand_voice","content","trash"]

    def validate(self,data):
        if data.get("content",None) is not None:
            content_length = len(data.get("content",None))
            if content_length < 5:
                raise ValidationError("Content length must be at least 5 characters.")
            data["content_summarize"]=summarize_in_tone(data.get("content",""))
        if data.get("brand_voice",None) is not None:
            brand_voice_length = len(data.get("brand_voice",None))
            if brand_voice_length < 2:
                raise ValidationError("brand voice length must be at least 5 characters.")
            if brand_voice_length > 40:
                raise ValidationError("brand voice max 20 character.")
            data["brand_voice"]=data.get("brand_voice","")
        return data
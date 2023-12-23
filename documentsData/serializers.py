# from rest_framework import serializers
from documentsData.models import Documents
from template.open_api_request import givemeBestTitle
from template.times_convert import format_time_elapsed,updated_time_format
# class DocumentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Documents
#         fields = "__all__"


from rest_framework import serializers
from documentsData.models import Documents
import base64
import json
import html
import time


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = "__all__"

    def get_decoded_content(self, instance):
        return base64.b64decode(instance.document_content).decode()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['document_content'] = instance.document_content
        data_str=representation['document_content']
        representation['created_at']=updated_time_format(representation["created_at"])
        representation['updated_at']=updated_time_format(representation["updated_at"])
        return representation


def add_br_tags(text):
    return text.replace('\n', '<br>')



# def create_data_block(text):
#     data_block = {
#         "time": int(time.time()) * 1000,  # Get the current timestamp in milliseconds
#         "blocks": [
#             {
#                 "id": "sheNwCUP5A",
#                 "type": "paragraph",
#                 "data": {
#                     "text": text,
#                     "level": 2
#                 }
#             }
#         ]
#     }
#     return data_block

import time

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
    final_data_block = {
        "time": int(time.time()) * 1000,
        "blocks": data_blocks
    }

    return final_data_block

class DocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = ["id","title","document_content","project_id","workspace_id"]
    
    def validate(self,data):
        data["user_id"]=self.context["user"].user
        if data.get("document_content","")=="Start From Here" or len(data.get("document_content",""))<=0 :
            data["title"]="Untitled"
        else:
            data["title"]=givemeBestTitle(data.get("document_content",""))

        document_content_string = data.get("document_content","")

        # ===========make the dta in editor format=============
        # output_data_block = create_data_block(add_br_tags(document_content_string))
        output_data_block = create_data_block(document_content_string)
        data["document_content"]=output_data_block
        # breakpoint()
        # ===========make the data in editor format=============

        # document_content_byte_encoded = base64.b64encode(str(output_data_block).encode('utf-8'))
        # document_content_encode_string = document_content_byte_encoded.decode('utf-8')
        # data["document_content"]=document_content_encode_string
        # data["document_content"]=document_content_encode_string
        return data

class DocumentPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = ["title","trash","favorite","dislike","like","knowledge_base","project_id","status"]

class DocumentPatchDoumentOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = ["document_content"]

    def get_decoded_content(self, instance):
        return base64.b64decode(instance.document_content).decode()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # representation['document_content'] = self.get_decoded_content(instance)
        return representation
    
    def validate(self,data):
        document_content_string = data.get("document_content","")
        # document_content_byte_encoded = base64.b64encode(document_content_string.encode('utf-8'))
        # document_content_encode_string = document_content_byte_encoded.decode('utf-8')
        # data["document_content"]=document_content_encode_string
        data["document_content"]=document_content_string
        return data
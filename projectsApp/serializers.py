from template.times_convert import format_time_elapsed,updated_time_format
from rest_framework import serializers
from projectsApp.models import Projects
from template.times_convert import format_time_month_day
from documentsData.models import Documents
from django.db.models import Count


class ProjectsCreateAppViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = "__all__"
    def validate(self,data):
        data["user_id"]=self.context["user"].user
        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['created_at'] = format_time_month_day(representation['created_at'])
        representation['updated_at'] = format_time_month_day(representation['updated_at'])
        return representation



class ProjectsAppViewSerializer(serializers.ModelSerializer):
    documents_data = serializers.SerializerMethodField()
    class Meta:
        model = Projects
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['created_at'] = format_time_month_day(representation['created_at'])
        representation['updated_at'] = format_time_month_day(representation['updated_at'])
        return representation
    def get_documents_data(self, instance):
        res=Documents.objects.filter(project_id=instance,trash=False).count()
        if res==0:
            data="no project"
        elif res==1:
            data="1 project"
        else:
            data=f"{res} projects"
        return data

class ProjectsPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ["project_name","trash"]


import base64
class DocumentsCount(serializers.ModelSerializer):
    class Meta:
        model=Documents
        fields="__all__"
    def to_representation(self,instance):
        repr={}
        repr["id"]=instance.id
        repr["title"]=instance.title
        content = instance.document_content
        # repr["document_content"]=(base64.b64decode(content).decode())
        repr["document_content"]=content
        repr["created_at"]=format_time_elapsed(instance.created_at)
        repr["updated_at"]=format_time_elapsed(instance.updated_at)
        return repr

class ProjectSingleViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['created_at'] = format_time_month_day(representation['created_at'])
        representation['updated_at'] = format_time_month_day(representation['updated_at'])
        representation["details"] = DocumentsCount(instance.project_id_for_document.filter(project_id=instance,trash=False),many=True).data
        # breakpoint()
        return representation
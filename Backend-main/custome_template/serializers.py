from rest_framework import serializers
from template.models import Template,Template_Field,Language,ProjectTemplate,TemplateAnswerModelOfUser,Categorie
from custome_template.models import *
class CustomFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomTemplateField
        fields = '__all__'

class CustomTemplateSerializer(serializers.ModelSerializer):
    template_fields = serializers.SerializerMethodField()

    class Meta:
        model = CustomTemplate
        fields = '__all__'


    def get_template_fields(self, obj):
        template_fields = CustomTemplateField.objects.filter(template=obj)
        serializer = CustomFieldSerializer(template_fields, many=True)
        return serializer.data

from rest_framework import serializers
from template.models import Template,Template_Field,Language,ProjectTemplate,TemplateAnswerModelOfUser,Categorie


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'
    def to_representation(self,data):
        repr={}
        # breakpoint()
        repr["data"]=data.category
        return repr

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'
    
    # def to_representation(self,data):
    #     representation = super().to_representation(data)
    #     # representation["categories"]=CategorieSerializer(Categorie.objects.filter(category=data.categories),many=True).data
    #     return representation

class Template_FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template_Field
        fields = '__all__'

class TemplateSelectedSerializer(serializers.ModelSerializer):
    template_fields = serializers.SerializerMethodField()

    class Meta:
        model = Template
        fields = '__all__'

    def get_template_fields(self, obj):
        template_fields = Template_Field.objects.filter(template=obj)
        serializer = Template_FieldSerializer(template_fields, many=True)
        return serializer.data

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class TemplateAnswerModelOfUserSerializer(serializers.ModelSerializer):
    answer_response = serializers.SerializerMethodField()

    class Meta:
        model = TemplateAnswerModelOfUser
        fields = '__all__'

    def get_answer_response(self, obj):
        return obj.get_decoded_answer_response()

class ProjectTemplateSerializer(serializers.ModelSerializer):
    template_answer = TemplateAnswerModelOfUserSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectTemplate
        fields = '__all__'



from rest_framework import serializers
from .models import UploadedImage

class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ('id', 'image', 'uploaded_at')

from rest_framework import serializers
from template.models import Template,Categorie,Template_Field
from api_docs.models import ChatAPIContentModel

class TemplateFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model=Template_Field
        fields="__all__"
    # def to_representation(self,instance):
    #     repr = {}
    #     return repr

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = "__all__"

# get inner fields of templates
class TemplateInnerFieldsSerializer(serializers.ModelSerializer):
    categories = CategorieSerializer(many=True)
    class Meta:
        model = Template
        fields = ["id","title","categories","description","icon"]

    def to_representation(self, instance):
        resp = super().to_representation(instance)
        template_fields = TemplateFieldSerializer(instance.TemplateIdTemplateField.all(), many=True).data
        template_fields = sorted(template_fields, key=lambda x: int(x['steps']))
        resp['template_fields'] = template_fields
        return resp


# single template serializer
class TemplateSerializer(serializers.ModelSerializer):
    categories = CategorieSerializer(many=True)
    class Meta:
        model = Template
        fields = ["id","title","categories","description","icon"]
        

    # def to_representation(self, instance):
    #     resp = super().to_representation(instance)
    #     return resp

class ChatApiContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatAPIContentModel
        fields = ["question"]
        


        

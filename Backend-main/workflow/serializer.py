from rest_framework import serializers
from template.models import Categorie
from workflow.models import WorkFlowTemplate,WorkFlowField,WorkFlowSteps



class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'
    def to_representation(self,data):
        repr={}
        repr["data"]=data.category
        return repr

class WorkFlowTemplateDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkFlowTemplate
        fields = '__all__'



# class WorkFlowFieldSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = WorkFlowField
#         fields = '__all__'

# class WorkFlowStepsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = WorkFlowSteps
#         fields = '__all__'



# class SingleWorkFlowTemplateDataSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = WorkFlowTemplate
#         fields = '__all__'
    


from workflow.models import WorkFlowSteps, WorkFlowField

class WorkFlowFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkFlowField
        fields = '__all__'



class WorkFlowStepsSerializer(serializers.ModelSerializer):
    fields = WorkFlowFieldSerializer(many=True, read_only=True)

    class Meta:
        model = WorkFlowSteps
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Get the inner fields for the current WorkFlowSteps instance
        inner_fields = WorkFlowField.objects.filter(WorkFlow_Steps=instance)
        
        # Sort inner_fields based on the step_no
        sorted_inner_fields = sorted(inner_fields, key=lambda field: field.step_no)
        
        # Serialize the sorted inner_fields
        sorted_inner_fields_data = WorkFlowFieldSerializer(sorted_inner_fields, many=True).data
        
        representation["inner_fields"] = sorted_inner_fields_data
        return representation

class WorkFlowStepsWorkFlowTemplateSerializer(serializers.ModelSerializer):
    WorkFlowTemplateId = WorkFlowStepsSerializer(many=True, read_only=True)

    class Meta:
        model = WorkFlowTemplate
        fields = '__all__'

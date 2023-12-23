from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from template.models import Template,Template_Field
from custome_template.models import ExampleKeyFeatureValueByCustomCustomer,CustomTemplate,CustomTemplateField,ExampleKeyFeatureValueByCustomCustomer

from django.http import JsonResponse
from subscriptions.check_subscription import restrict_user,restrict_user_views


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from subscriptions.models import Subscription

def get_all_field_names(model):
    return [field.name for field in model._meta.get_fields()]
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def CustomeTemplate(request):
    data = {"restrict_user": True}
    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)
    
    # create template 
    # ( trail don't create )
    # starter -> 10 template
    # premium -> 20 template

    ins_sub=Subscription.objects.get(user_id=request.user)


    if request.method == 'POST':
        if ins_sub.status=="trial":
            return Response({"message":"Upgrade Your Plan"},status=400)
        
        if ins_sub.plan=="starter":
            if CustomTemplate.objects.filter(user_id=request.user).count()>=10:
                return Response({"message":"Exceeded limits for starter only 10 templates"},status=400)

        if ins_sub.plan=="premium":
            if CustomTemplate.objects.filter(user_id=request.user).count()>=10:
                return Response({"message":"Exceeded limits for premium only 20 templates"},status=400)
        belongs_to_template=Template.objects.get(id= request.data.get('ids',None))
        try:

            instace_of_custome_template = CustomTemplate.objects.create(
            template_taken_from=belongs_to_template,what_to_generate=belongs_to_template.what_to_generate,icon=belongs_to_template.icon,title=request.data.get('templateName',belongs_to_template.title),description=belongs_to_template.description,
            user_id=request.user,
            )
        except Exception as e:
            return Response({"message":str("Template Name already exist")},status=400)
        template_fields_instance = Template_Field.objects.filter(template=belongs_to_template.id).values(
            "title","pre_define_value","template","component","type_field","label","required","placeholder","range_of_text","maxLength")
        restrict_feature_create_count=0
        data=request.data
        keys = data.keys()
        for data in template_fields_instance:
            for keys_from_request in list(keys):
                if str(keys_from_request) == str(data["title"]):
                    inner_custom_template_fields_instance = CustomTemplateField.objects.create(
                        title=data["title"], 
                        pre_define_value=request.data.get(keys_from_request),
                        template=instace_of_custome_template,
                        component=data["component"],
                        type_field=data["type_field"],
                        label=data["label"],
                        required=data["required"],
                        placeholder=data["placeholder"],
                        range_of_text=data["range_of_text"],
                        maxLength=data["maxLength"],
                    )
        for data in template_fields_instance:
            if "key_feature" in request.data:
                if len(request.data["key_feature"]) > 0:
                    if restrict_feature_create_count==0:
                        example_instance=Template_Field.objects.get(title="Example")
                        inner_custom_template_fields_instance = CustomTemplateField.objects.create(
                            title=example_instance.title,
                            pre_define_value="",
                            template=instace_of_custome_template,
                            component=example_instance.component,
                            type_field=example_instance.type_field,
                            label=example_instance.label,
                            required=example_instance.required,
                            placeholder=example_instance.placeholder,
                            range_of_text=example_instance.range_of_text,
                            maxLength=example_instance.maxLength,
                        )
                        for data in request.data["key_feature"]:
                            ExampleKeyFeatureValueByCustomCustomer.objects.create(
                                inner_template=inner_custom_template_fields_instance,
                                outer_template=instace_of_custome_template,
                                key=data["key"],
                                value=data["value"]
                            )
                        restrict_feature_create_count=restrict_feature_create_count+1

        inner_custom_template_fields_instance = CustomTemplateField.objects.create(
                            title="Tone of voice",
                            pre_define_value="",
                            template=instace_of_custome_template,
                            component="select",
                            type_field="string",
                            label="Tone of voice",
                            required=True,
                            placeholder="Tone of voice",
                            range_of_text=30,
                            maxLength=20,
                        )

        return Response({'message':"Template created","id":instace_of_custome_template.id},status=201)
        # return Response({'message': 'Data received successfully!'})
    elif request.method == 'GET':
        # resp = CustomTemplate.objects.filter(user_id=request.user).values(*field_names).distinct()
        resp = CustomTemplate.objects.filter(user_id=request.user).values("id","template_taken_from","title","description","premium","active","icon")
        resp = [{"custome": "user", **data} for data in resp]
        return Response(resp, status=200)
    else:
        return Response({'message': 'Invalid request method'}, status=405)


from custome_template.serializers import CustomFieldSerializer,CustomTemplateSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_single_template(request,id):
    data = {"restrict_user": True}
    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)
    try:
        custom_template = CustomTemplate.objects.get(id=id)
    except CustomTemplate.DoesNotExist:
        return Response({'message': 'Custom template not found'}, status=404)
    if request.method == 'GET':
        serializer = CustomTemplateSerializer(custom_template)
        return Response([serializer.data], status=200)
    else:
        return Response({'message': 'Invalid request method'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_example_value(request,id):
    if request.method == 'GET':
        resp = ExampleKeyFeatureValueByCustomCustomer.objects.filter(outer_template=id).values('key','value')
        return Response(resp, status=200)
    else:
        return Response({'message': 'Invalid request method'}, status=405)

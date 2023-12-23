from django.shortcuts import render

from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.db.models import F

from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from subscriptions.check_subscription import restrict_user,restrict_user_views
from team_members.models import InitialWorkShopOfUser
from subscriptions.models import Subscription

from workflow.models import WorkFlowTemplate

from django.db.models import Q
from workflow.serializer import WorkFlowTemplateDataSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetWorkFlowTemplate(request):
    data = {"restrict_user": True}

    restrict_user_check = restrict_user_views(request.user)
    if restrict_user_check is False:
        return JsonResponse(data, status=400)

    categories = request.GET.get('category')
    search_query = request.GET.get('search')

    WorkFlowTemplateData = WorkFlowTemplate.objects.filter(active=True)

    # Apply category filter if categories are provided
    if categories and categories.lower() not in ["all", "all"]:
        categories_list = categories.split(",")  # Convert comma-separated values to a list
        category_filter = Q()
        for category_ in categories_list:
            tmp_id = Categorie.objects.get(category__icontains=category_)  # Use 'exact' for case-sensitive comparison
            category_filter |= Q(categories__id=tmp_id.id)
        WorkFlowTemplateData = WorkFlowTemplateData.filter(category_filter)

    # Apply search filter if search query is provided
    if search_query:
        model_fields = [field.name for field in Template._meta.get_fields() if field.concrete]
        search_filter = Q()
        model_fields.pop()
        for field in model_fields:
            if field.endswith("_id"):
                # Exclude ForeignKey fields from the search filter
                continue
            search_filter |= Q(**{f"{field}__icontains": search_query})
        WorkFlowTemplateData = WorkFlowTemplateData.filter(search_filter)

    serializer = WorkFlowTemplateDataSerializer(WorkFlowTemplateData, many=True)
    sorted_data = sorted(serializer.data, key=lambda x: (not x['premium'], x['title'].lower()))

    # Remove duplicate data, if any
    unique_data = []
    unique_titles = set()
    for data in sorted_data:
        if data['title'] not in unique_titles:
            unique_data.append(data)
            unique_titles.add(data['title'])

    return Response(unique_data)


from rest_framework import generics
from workflow.models import WorkFlowTemplate
from workflow.serializer import WorkFlowStepsWorkFlowTemplateSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetDataSingleOfWorkFlow(request,data):
    queryset = WorkFlowTemplate.objects.filter(id=data)
    serializer_class = WorkFlowStepsWorkFlowTemplateSerializer(queryset,many=True)
    return Response(serializer_class.data,200)


from brand_voice.models import Brandvoice

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def select_tone(request):

    # options=["Nice","Fancy", "Relaxed","Skilled", "Confident", "Daring","Funny", "Persuasive", "Empathetic"]
    options=[]
    # query_set = Brandvoice.objects.filter(user_id=123).values('brand_voice')
    query_set = Brandvoice.objects.filter(user_id=request.user).values('brand_voice')
    for data in query_set:
        options.append(data["brand_voice"])
    # breakpoint()
    return JsonResponse({"options": options})

from template.open_api_request import makechatrequest
from documentsData.models import Documents

import secrets
import string

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def outputdata(request):
    
    # check the subscription plan
    wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    wrk_ins.workspace_id
    wrk_ins.owner_of_workspace

    # if trail then restrict image generated
    ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)
    
    if ins_subs.status == "trial":
        return Response({"message":"In Trail you cannot use WorkFlow"},status=400)


    formatted_data = []
    modified_data=request.data
    doc_id=request.data.get('document_id')
    del modified_data["document_id"]
    for key, value in modified_data.items():
        formatted_key = key.replace('*', '').strip()
        formatted_data.append(f"{formatted_key} : {value}\n Generate in Paragraph not in list or points don't give title head , just give paragraph")

    result = '\n'.join(formatted_data)
    response_from_openapi=makechatrequest(result)


    # random id for blocks to save
    N = 7    
    id_for_blocks = ''.join(secrets.choice(string.ascii_uppercase + string.digits)for i in range(N))
    # get the document id and request it exists or not
    ins_doc=Documents.objects.get(id=doc_id)

    new_block = {'id': id_for_blocks, 'type': 'paragraph', 'data': {'text': response_from_openapi}}
    ins_doc.document_content['blocks'].append(new_block)
    ins_doc.save()

    return JsonResponse({"resp_data": response_from_openapi})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def output_(request):

    # check the subscription plan
    wrk_ins=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    wrk_ins.workspace_id
    wrk_ins.owner_of_workspace

    # if trail then restrict image generated
    ins_subs=Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)
    
    if ins_subs.status == "trial":
        return Response({"message":"In Trail you cannot use WorkFlow"},status=400)

    formatted_data = []
    modified_data=request.data
    for key, value in modified_data.items():
        formatted_key = key.replace('*', '').strip()
        formatted_data.append(f"{formatted_key} : {value}")
    
    send_to_open_api=[]
    if "title" in formatted_data[0].lower():
        # only two words each words 5 character
        send_to_open_api.append(formatted_data[0]+"\n Two word best title not long each words 5 character long for this topic only once not in list")
    else:
        send_to_open_api.append(formatted_data[0]+"\n Generate in Paragraph not in points and summarize this text in 10 words")
    response_from_openapi=makechatrequest(send_to_open_api[0])
    # response_from_openapi="Boom Boom"
    return JsonResponse({"resp_data": response_from_openapi})
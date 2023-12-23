
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from chat_template.models import ChatFirstTemplateModel,ChatSecondStepTemplateModel,CustomeChatTemplateOfUser
from chat_template.serializers import ChatTemplateModelGetSerializer,ChatFirstTemplateNestedModelSerializer,ChatSecondStepTemplateNestedModelSerializer,ChatTemplateModelGetSerializer,ChatTemplateModelCreateSerializer,ChatCustomeTemplateModelGetSerializer

from rest_framework.permissions import IsAuthenticated , AllowAny

from django.http import JsonResponse
from subscriptions.check_subscription import restrict_user,restrict_user_views

from django.db.models import Q

class ChatTemplateViewSet(viewsets.ViewSet):
    permission_classes=[IsAuthenticated]
    def list(self,request):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        search_param = request.query_params.get('search', None)
        queryset = ChatFirstTemplateModel.objects.filter(trash=False)
        
        if search_param:
            queryset = queryset.filter(Q(chat_template_name__icontains=search_param)| Q(description__icontains=search_param))
        
        serializer = ChatTemplateModelGetSerializer(queryset,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self,request,pk=None):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        if id is not None:
            # try:
            ChatFirstTemplateModelInstance = ChatFirstTemplateModel.objects.get(id=pk,trash=False)
            serializer = ChatFirstTemplateNestedModelSerializer(ChatFirstTemplateModelInstance)
            return Response(serializer.data)
            # except:
            #     return Response({'message':'doesnt exits'},status=400)

class ChatSecondStepTemplateViewSet(viewsets.ViewSet):
    permission_classes=[IsAuthenticated]
    def retrieve(self,request,pk=None):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        if id is not None:
            try:
                ChatSecondStepTemplateModelInstance = ChatSecondStepTemplateModel.objects.get(id=pk,trash=False)
                serializer = ChatSecondStepTemplateNestedModelSerializer(ChatSecondStepTemplateModelInstance)
                return Response(serializer.data)
            except:
                return Response({'message':'doesnt exits'},status=400)





# =============form here custom template =========================
class CustomTemplateViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def list(self,request):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        queryset = CustomeChatTemplateOfUser.objects.filter(user_id=request.user.id, trash=False).order_by("-created_at")
        serializer = ChatCustomeTemplateModelGetSerializer(queryset,many=True)
        return Response(serializer.data)

    def create(self,request):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        serializer = ChatTemplateModelCreateSerializer(data=request.data,context={"user":request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self,request,pk=None):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        if id is not None:
            instance = CustomeChatTemplateOfUser.objects.get(id=pk,trash=False)
            serializer = ChatCustomeTemplateModelGetSerializer(instance)
            return Response(serializer.data,status=200)
    
    
    def partial_update(self,request,pk):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        CustomeChatInstance = CustomeChatTemplateOfUser.objects.get(pk=id)
        serializer = ChatTemplateModelCreateSerializer(CustomeChatInstance,data=request.data,partial=True,context={"user":request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Data update'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def destroy(self,request,pk):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        CustomeChatInstanceData = CustomeChatTemplateOfUser.objects.get(pk=id, trash=False)
        CustomeChatInstanceData.trash=True
        CustomeChatInstanceData.save()
        return Response({'message':'Data deleted'})
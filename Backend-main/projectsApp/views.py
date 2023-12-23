from django.shortcuts import render
from rest_framework.response import Response
from projectsApp.serializers import ProjectsAppViewSerializer,ProjectsCreateAppViewSerializer,ProjectsPatchSerializer,ProjectSingleViewSerializer
from projectsApp.models import Projects
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes

from django.http import JsonResponse
from subscriptions.check_subscription import restrict_user,restrict_user_views


# from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated , AllowAny
# from rest_framework.authentication import BasicAuthentication
# from rest_framework.throttling import UserRateThrottle

# from rest_framework.pagination import PageNumberPagination
from documentsData.models import Documents


from rest_framework import viewsets, pagination
from django.db.models import Q
class PageNumberPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProjectsViewSet(viewsets.ViewSet):
    permission_classes=[IsAuthenticated]
    def list(self,request):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        workspace_id = request.GET.get('workspace_id',None)
        if workspace_id is None:
            return Response({'message':'Not permitted'},status=400)

        search_query = request.GET.get('search')
        ProjectsInstance = Projects.objects.filter(user_id=request.user,workspace_id=workspace_id,trash=False).order_by('-created_at')

        # if search_query:
        #     ProjectsInstance = ProjectsInstance.filter(Q(title__icontains=search_query) | Q(document_content__icontains=search_query))

        # paginator = PageNumberPagination()
        # page = paginator.paginate_queryset(ProjectsInstance, request)

        # if page is not None:
        #     serializer = ProjectsAppViewSerializer(page, many=True)
        #     return paginator.get_paginated_response(serializer.data)
        # else:
        serializer = ProjectsAppViewSerializer(ProjectsInstance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    def create(self,request):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)

        workspace_id = request.data.get('workspace_id',None)
        if workspace_id is None:
            return Response({'message':'Not permitted'},status=400)

        serializer = ProjectsCreateAppViewSerializer(data=request.data,context={'user':request})
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
            # try:
            ProjectsInstance = Projects.objects.get(id=pk)
            serializer = ProjectSingleViewSerializer(ProjectsInstance)
            return Response(serializer.data)
            # except:
            #     return Response({'message':'doesnt exits'},status=400)


    
    def partial_update(self,request,pk):
        data = {"restrict_user": True}
        restrict_user_check = restrict_user_views(request.user)
        if restrict_user_check is False:
            return JsonResponse(data, status=400)
        id = pk
        try:
            if request.data.get('trash',None) is not None:
                instance_of_doc = Documents.objects.filter(project_id=pk)
                for doc_id in instance_of_doc:
                    ins_doc=Documents.objects.get(id=doc_id.id)
                    ins_doc.trash=True
                    ins_doc.project_id=None
                    ins_doc.save()
            ProjectsInstance = Projects.objects.get(pk=id)
            if ProjectsInstance.user_id.id==request.user.id:
                serializer = ProjectsPatchSerializer(ProjectsInstance,data=request.data,partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response({"message":"updated"},status=status.HTTP_201_CREATED)
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            return Response({'message':'update not permitted'},status=401)
        except:
            return Response({'message':'doesnt exits'},status=400)
    
    # def destroy(self,request,pk):
    #     id = pk
    #     if id is not None:
    #         try:
    #             DocumentsInstance = Documents.objects.get(pk=id)
    #             if DocumentsInstance.user_id.id==request.user.id:
    #                 DocumentsInstance.delete()
    #                 return Response({'message':'Data deleted'})
    #             return Response({'message':'update not permitted'},status=401)
    #         except:
    #             return Response({'message':'doesnt exits'},status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_choose(request):
    # workspace_id
    workspace_id = request.GET.get('workspace_id',None)
    if workspace_id is None:
        return Response({'message':'Not permitted'},status=400)

    # query_set = Projects.objects.filter(user_id=request.user,trash=False).values('id','project_name')
    query_set = Projects.objects.filter(user_id=request.user,workspace_id=workspace_id,trash=False).values('id','project_name')
    # transformed_data = [{"value": item["id"], "label": item["project_name"]} for item in query_set]
    transformed_data = [{"value": item["id"], "label": item["project_name"]} for item in query_set]
    transformed_data.insert(0, {"value": "default", "label": "default"})
    return Response(transformed_data,status=200)

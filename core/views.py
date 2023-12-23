from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from rest_framework import status
from accounts.models import UserAccount
# def index(request):
    # return render(request,'index.html')


@csrf_exempt
def logout(request):
    if request.method == 'POST':
        response = HttpResponseRedirect('')
        response.delete_cookie('refresh_token')
        return response
    else:
        content = {'message': 'Something went wrong in space'}
        return Response(content)

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    if request.method == 'GET':
        print(request.user.id)
        _user_data_ = UserAccount.objects.filter(id=request.user.id).values('id','email','first_name','last_name','is_active','profile_pic')
        return Response(_user_data_)
    else:
        content = {'message': 'Something went wrong in space'}
        return Response(content)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    print(request.user.id)
    images = request.FILES.getlist('profile_pic')
    print(images)
    # MyTable.objects.filter(pk=some_value).update(field1='some value')
    # profile_pic
    content = {'message': 'good'}
    return Response(content)



from django.urls import path ,include
from api_docs import views
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

#creating routers
router = DefaultRouter()

#Register BookViewSet with Router
router.register('templates', views.TemplateViewSet,basename='Templates')
router.register('generate_template_response', views.GenerateTemplateResponse,basename='GenerateTemplateResponse')

urlpatterns = [
    path('',include(router.urls)),
    path('ask_question/',views.ChatResponseView.as_view(),name='generate_stream'),
]
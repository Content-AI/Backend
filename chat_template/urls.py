from django.urls import path ,include
from chat_template import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('chat-template', views.ChatTemplateViewSet,basename='ChatTemplateViewSet')
router.register('get-value-template', views.ChatSecondStepTemplateViewSet,basename='ChatSecondStepTemplateViewSet')
router.register('custom-template', views.CustomTemplateViewSet,basename='CustomTemplateViewSet')

urlpatterns = [
    path('',include(router.urls)),
    # path('',include(router.urls)),
    # path('',include(router.urls)),
]
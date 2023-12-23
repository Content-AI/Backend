from django.urls import path ,include
from chat import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('title', views.ChatTitleViewSet,basename='ChatTitleViewSet')
# router.register('ask', views.ChatAskViewSet,basename='ChatAskViewSet')

urlpatterns = [
    path('_chat_api_/',include(router.urls)),
    # path('_chat_question_/',include(router.urls)),
    path('_chat_question_/ask/',views.ChatResponseView.as_view(),name='generate_stream'),
    # path('ask_question_sync/', views.ask_question_sync),
]
from django.urls import path ,include
from brand_voice import views
from brand_voice.views import ExtractTextFromUrls
from brand_voice.views import ExtractDataFromFiles

from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('data', views.BrandVoiceViewSets,basename='BrandVoiceViewSets')

urlpatterns = [
    path('',include(router.urls)),
    path('extract-url/', ExtractTextFromUrls.as_view(), name='extract_text'),
    path('extract-file/', ExtractDataFromFiles.as_view(), name='extract_pdf'),
]
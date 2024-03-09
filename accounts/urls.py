from django.urls import path, include
from accounts import views
from rest_framework_simplejwt.views import (TokenRefreshView)
from rest_framework.routers import DefaultRouter
from .views import generate_new_api_key,Login, get_api_key, why_subscribe, create_tickets, google_update, linkedin, visitor_data, track_visitor, total_account, users_data, GeneralSettingViewSet, CookieTokenRefreshView, GoogleSocialAuthView, FacebookSocialAuthView, CookieTokenObtainPairView

from accounts.views import VisitorDataApiView
from accounts.views import AggregatedVisitorStats,Login


router = DefaultRouter()
router.register('user', views.RegisterView, basename='register_acc')
router.register('general-setting', views.GeneralSettingViewSet,
                basename='GeneralSetting')

urlpatterns = [
    path("", include(router.urls)),
    # path("create/",include(router.urls)),
    path('users_data/', views.users_data, name='users_data'),
    path('accounts_data/token/refresh/',
         CookieTokenRefreshView.as_view(), name='token_refresh'),

    path('register/google/', GoogleSocialAuthView.as_view()),

    path('register/google_update/', views.google_update, name='google_update'),
    path('register/linkedin/', views.linkedin, name='linkedin'),

    # path('register/facebook/', FacebookSocialAuthView.as_view()),

    path('accounts_data/login_using_token/',
         views.generate_otp_by_email, name='generate_otp_by_email'),

    path('generate/auth_token/', views.login_user_using_token,
         name='login_user_using_token'),

    path('survey/data/', views.survey_data, name='survey_data'),

    path('total_account/', views.total_account, name='total_account'),
    path('acc/', views.track_visitor, name='track-visitor'),
    path('visitor_data/', views.visitor_data, name='visitor_data'),
    # path('grouped-visitor-data/', VisitorDataApiView, name='grouped-visitor-data'),
    path('grouped-visitor-data/', VisitorDataApiView.as_view(),
         name='visitor_data_api'),
    path('aggregated-visitor-stats/', AggregatedVisitorStats.as_view(),
         name='aggregated-visitor-stats'),

    path('create-tickets/', views.create_tickets, name='create-tickets'),
    path('why-subscribe/', views.why_subscribe, name='why_subscribe'),


    path('generate_new_api_key/', views.generate_new_api_key,
         name='generate_new_api_key'),

    path('get_api_key/', views.get_api_key, name='get_api_key'),


     path('accounts_data/login/',
         Login.as_view(), name='login'),


]

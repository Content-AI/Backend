# from unicodedata import name
from django.contrib import admin
from django.urls import path,include , re_path

from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# from . import views
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from django.shortcuts import redirect

from core import settings


from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


version = "v1"
''' 
    api's user verions
    for user middleware version to work
'''
version_api = "v1"


common_url_patterns=[
    path(f'{version}/api/', include('api_docs.urls')),
]


schema_view = get_schema_view(
    openapi.Info(
        title="JYRA AI",
        default_version='v1',
        description="JYRA AI",
        terms_of_service="#",
        contact=openapi.Contact(email="test@test.org"),
        license=openapi.License(name="JYRA AI API"),
    ),
    public=True,
    patterns=common_url_patterns,
    permission_classes=(permissions.AllowAny,),
)
# ends here


# if not settings.pro:
common_url_patterns += [
    re_path(r'^doc(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('doc/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

url_patterns_for_auth = [
    path(f'{version}/accounts/', include('accounts.urls')),
    path('admin/', lambda request: redirect('/admin/template/tokengeneratedbyopenai/')),
    path('admin/', admin.site.urls),
    path(f'{version}/auth/', include('djoser.urls')),
]



urlpatterns = [
    path(f'{version_api}/chat/', include('chat.urls')),
    path(f'{version_api}/template/', include('template.urls')),
    path(f'{version_api}/documents_data/', include('documentsData.urls')),
    path(f'{version_api}/projects_data/', include('projectsApp.urls')),
    path(f'{version_api}/brand_voice/', include('brand_voice.urls')),
    path(f'{version_api}/chat_template/', include('chat_template.urls')),
    path(f'{version_api}/custom_template/', include('custome_template.urls')),
    path(f'{version_api}/subscription/', include('subscriptions.urls')),
    path(f'{version_api}/team_members/', include('team_members.urls')),
    path(f'{version_api}/workflow/', include('workflow.urls')),
    path(f'{version_api}/business_plan/', include('business_plan.urls')),
    path(f'{version_api}/create_advertisement/', include('create_advertisement.urls')),
]

urlpatterns = urlpatterns +url_patterns_for_auth+common_url_patterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
from django.urls import path ,include
from documentsData import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('document', views.DocumentViewSet,basename='DocumentViewSet')
# router.register('action', views.DocumentTrashAPIView,basename='DocumentTrashViewSet')
router.register('encode', views.DocumentPatchViewSet,basename='DocumentPatchViewSet')

urlpatterns = [
    path('',include(router.urls)),
    path('doc_patch/',include(router.urls)),
    path('doc_question/', views.doc_question, name='doc_question'),
    path('doc_trash/', views.DocumentTrashAPIView.as_view(), name='document-trash'),
    path('doc_trash_delete/', views.DocumentTrashDeleteAPIView.as_view(), name='document-trash-delete'),
    path('doc_project_id_update/', views.ProjectBulkUpdateAPIView.as_view(), name='document-project-id'),
    path('upload-image/', views.upload_image, name='upload_image'),
    path('get_doc_file/<str:data>/', views.get_doc_file, name='get_doc_file'),
    path('remove_edit_permission_doc/<str:data>/', views.remove_edit_permission_doc, name='remove_edit_permission_doc'),
]
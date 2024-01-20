from django.urls import path
from .views import PhotoListCreateView,CreateFromApiDocumentList



urlpatterns = [
    path('photos/', PhotoListCreateView.as_view(), name='photo-list-create'),
    # path('create_ads/', PhotoRetrieveUpdateDestroyView.as_view(), name='photo-get-list-create'),
    # path('create_ads/<str:pk>/', PhotoRetrieveUpdateDestroyView.as_view(), name='photo-retrieve-update-destroy'),
    path('save_data_from_api/<str:pk>/', CreateFromApiDocumentList.as_view(), name='get-photo-list-create'),
]
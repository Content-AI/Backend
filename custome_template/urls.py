from django.urls import path
from custome_template.views import CustomeTemplate,get_single_template,get_example_value

urlpatterns = [
    path('create_get/', CustomeTemplate, name='CreateTemplate'),
    path('get_single_template/<str:id>', get_single_template, name='get_single_template'),
    path('get_example_value/<str:id>', get_example_value, name='get_example_value'),
]

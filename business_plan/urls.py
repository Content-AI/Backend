from django.urls import path ,include
from business_plan.views import *


urlpatterns = [
    path('contact_sales', contact_sales, name='TemplateDef'),
]
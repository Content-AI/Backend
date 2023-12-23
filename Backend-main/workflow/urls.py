from django.urls import path ,include
from workflow.views import GetWorkFlowTemplate,GetDataSingleOfWorkFlow,outputdata,output_,select_tone


urlpatterns = [
    path('data', GetWorkFlowTemplate, name='GetWorkFlowTemplate'),
    path('single_workflow/<str:data>', GetDataSingleOfWorkFlow, name='GetDataSingleOfWorkFlow'),
    path('output', outputdata, name='outputdata'),
    path('output_', output_, name='output_'),
    path('select_tone', select_tone, name='select_tone'),
]
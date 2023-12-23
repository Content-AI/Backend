from django.contrib import admin
from workflow.models import WorkFlowTemplate,WorkFlowSteps,WorkFlowField

class WorkFlowTemplateAdmin(admin.ModelAdmin):
    list_display = ['title','premium', 'active',"important","created_at"]
    list_filter = ['premium', 'active']
    search_fields = ['title','description']
    ordering = ['-created_at']
    list_per_page = 20

admin.site.register(WorkFlowTemplate, WorkFlowTemplateAdmin)

class WorkFlowStepsAdmin(admin.ModelAdmin):
    list_display = ["title","step_title","step_no","WorkFlowTemplate","created_at"]
    list_filter = ["title","step_title","step_no","WorkFlowTemplate"]
    search_fields = ["title","step_title","step_no","WorkFlowTemplate__title"]
    ordering = ['-created_at']
    list_per_page = 20

admin.site.register(WorkFlowSteps, WorkFlowStepsAdmin)

class WorkFlowFieldAdmin(admin.ModelAdmin):
    list_display = ["label_title","WorkFlow_Steps","pre_define_value","component","type_field","required","placeholder","range_of_text","maxLength","created_at"]
    list_filter = ["label_title","WorkFlow_Steps","pre_define_value","component","type_field","required","placeholder","range_of_text","maxLength","created_at"]
    search_fields = ["label_title","WorkFlow_Steps__title","pre_define_value","component","type_field","required","placeholder","range_of_text","maxLength","created_at"]
    ordering = ['-created_at']
    list_per_page = 20

admin.site.register(WorkFlowField, WorkFlowFieldAdmin)


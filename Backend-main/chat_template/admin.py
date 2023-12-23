from django.contrib import admin
from chat_template.models import ChatFirstTemplateModel,ChatSecondStepTemplateModel,ChatThirdValueOfTemplateModel,CustomeChatTemplateOfUser

class Chat_Template_Name_Admin(admin.ModelAdmin):
    list_display = ['chat_template_name','description']
    list_filter = ['chat_template_name','description']
    search_fields = ['chat_template_name','description']
    ordering = ['chat_template_name','description']
    list_per_page = 20

class chat_first_step_template_model_Admin(admin.ModelAdmin):
    list_display = ['chat_first_step_template_name','description']
    list_filter = ['chat_first_step_template_name','description']
    search_fields = ['chat_first_step_template_name','description']
    ordering = ['chat_first_step_template_name','description']
    list_per_page = 20

class chat_value_of_template_model_Admin(admin.ModelAdmin):
    list_display = ['value_of_prompt','description']
    list_filter = ['value_of_prompt','description']
    search_fields = ['value_of_prompt','description']
    ordering = ['value_of_prompt','description']
    list_per_page = 20

admin.site.register(ChatFirstTemplateModel, Chat_Template_Name_Admin)
admin.site.register(ChatSecondStepTemplateModel, chat_first_step_template_model_Admin)
admin.site.register(ChatThirdValueOfTemplateModel, chat_value_of_template_model_Admin)
# admin.site.register(CustomeChatTemplateOfUser)

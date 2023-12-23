from django.contrib import admin
from template.models import TranscribeSpeechModal,TempVideoDetails,GenerateAudioToSpeech,HowToSummarizeText,GeneratedImageByuser,PerTokenGeneratedByOpenAI as PerTokenByUser,SingleUserTokenGenerated,TokenGeneratedByOpenAI,UploadedImage,Template,TempalteSelectFieldOptions,Template_Field,Categorie,Language,TemplateAnswerModelOfUser,ProjectTemplate
from template.models import OpenAiToken
class TemplateAdmin(admin.ModelAdmin):
    list_display = ['title','premium', 'active',"important"]
    list_filter = ['premium', 'active']
    search_fields = ['title','description']
    ordering = ['title']
    list_per_page = 20
class Template_FieldAdmin(admin.ModelAdmin):
    list_display = ["title","steps","template","component"]
    list_filter = ["title","component"]
    search_fields = ["title","pre_define_value","type_field","label","template__title"]
    ordering = ['steps']
    list_per_page = 20
class TemplateAnswerModelOfUserAdmin(admin.ModelAdmin):
    # list_display = ["title","template","component"]
    # list_filter = ["title","component"]
    search_fields = ["answer_response"]
    ordering = ['-created_at']
    list_per_page = 20


class OpenAiTokenAdmin(admin.ModelAdmin):
    list_display = ["token_generated","updated_at"]

admin.site.register(Template, TemplateAdmin)
admin.site.register(Template_Field,Template_FieldAdmin)
admin.site.register(Language)
# admin.site.register(TranscribeSpeechModal)
# admin.site.register(TemplateAnswerModelOfUser,TemplateAnswerModelOfUserAdmin)
# admin.site.register(ProjectTemplate)
admin.site.register(Categorie)
# admin.site.register(UploadedImage)
admin.site.register(TempalteSelectFieldOptions)
admin.site.register(OpenAiToken,OpenAiTokenAdmin)
# admin.site.register(TokenGeneratedByOpenAI)
# admin.site.register(PerTokenByUser)
# admin.site.register(GeneratedImageByuser)
# admin.site.register(GenerateAudioToSpeech)
admin.site.register(HowToSummarizeText)
# admin.site.register(TempVideoDetails)



# class SingleUserTokenGeneratedAdmin(admin.ModelAdmin):
#     list_display = ["token_generated","default_name","created_at"]
#     list_filter = ["token_generated","default_name","created_at"]

# admin.site.register(SingleUserTokenGenerated, SingleUserTokenGeneratedAdmin)

from django.contrib import admin
from .models import SingleUserTokenGenerated

# admin.site.register(SingleUserTokenGenerated)

@admin.register(TokenGeneratedByOpenAI)
class TokenGeneratedByOpenAIAdmin(admin.ModelAdmin):
    change_list_template = 'admin/tokengeneratedbyopenai_change_list.html'

@admin.register(PerTokenByUser)
class PerTokenByUserAdmin(admin.ModelAdmin):
    change_list_template = 'admin/pertokenbyuser_index.html'




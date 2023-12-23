from django.contrib import admin
from django.contrib.auth import get_user_model
from accounts.models import *
User = get_user_model()

class GenerateWordRestrictionForUserAdmin(admin.ModelAdmin):
    list_display = ['user','words']
    list_filter = ['user','words']
    search_fields = ['user__email','words']
    ordering = ['created_at']
    list_per_page = 20

admin.site.register(GenerateWordRestrictionForUser, GenerateWordRestrictionForUserAdmin)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email","first_name","last_name","status"]
    list_filter = ["email","first_name","last_name","status"]
    search_fields = ["email","first_name","last_name","status"]
    ordering = ['created_at']
    list_per_page = 20

class UserFromHubSpotAdmin(admin.ModelAdmin):
    list_display = ["email"]
    list_filter =  ["email"]
    search_fields =  ["email","hubspot_user_id"]
    list_per_page = 20

admin.site.register(User, UserAdmin)
admin.site.register(UserFromHubSpot, UserFromHubSpotAdmin)

# admin.site.register(User)
admin.site.register(Visitor)
# admin.site.register(UserApiKey)
# admin.site.register(SendEmailToUser)
# admin.site.register(UserTokenGenerated)
admin.site.register(OTP_TOKEN)
# admin.site.register(GeneralSetting)




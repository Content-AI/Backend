from django.contrib import admin
from custome_template.models import CustomTemplate,CustomTemplateField,ExampleKeyFeatureValueByCustomCustomer

class CustomTemplateAdmin(admin.ModelAdmin):
    list_display = ['title','premium', 'active']
    list_filter = ['premium', 'active']
    search_fields = ['title','description']
    ordering = ['title']
    list_per_page = 20
class CustomTemplateFieldAdmin(admin.ModelAdmin):
    list_display = ["title","template","component"]
    list_filter = ["title","component"]
    search_fields = ["title","pre_define_value","type_field","label"]
    ordering = ['title']
    list_per_page = 20

admin.site.register(CustomTemplate, CustomTemplateAdmin)
# admin.site.register(CustomTemplateField,CustomTemplateFieldAdmin)
# admin.site.register(ExampleKeyFeatureValueByCustomCustomer)

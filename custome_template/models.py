from django.db import models
from accounts.models import UserAccount
from django.core.validators import MinLengthValidator
import uuid
from multiselectfield import MultiSelectField
from accounts.models import UserAccount
import base64
from template.models import Template


class CustomTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template_taken_from=models.ForeignKey(Template, on_delete=models.CASCADE, related_name="template_belongs_to")
    title = models.CharField(max_length=40,unique=True)
    what_to_generate = models.TextField(default="")
    description = models.TextField()
    premium = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    icon = models.ImageField(upload_to='icons/')
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="custom_add_by_user")

    def __str__(self):
        return self.title




class CustomTemplateField(models.Model):
    COMPONENT_CHOICES = [
        ('text', 'text'),
        ('textarea', 'textarea'),
        ('select', 'select'),
        ('Example', 'Example'),
    ]
    TYPE_CHOICES = [
        ('string', 'string'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=80)
    pre_define_value = models.TextField(null=True,blank=True)
    template= models.ForeignKey(CustomTemplate,on_delete=models.CASCADE,related_name="CustomTemplateIdTemplateField")
    component = models.CharField(max_length=20, choices=COMPONENT_CHOICES)
    type_field = models.CharField(max_length=20, choices=TYPE_CHOICES)
    label = models.CharField(max_length=100,null=True,blank=True)
    required = models.BooleanField(default=True)
    placeholder = models.CharField(max_length=100)
    range_of_text = models.PositiveIntegerField()
    maxLength = models.PositiveIntegerField(null=True,blank=True)

    def __str__(self):
        return str(self.title)+"  ( "+str(self.template) +" )"


class ExampleKeyFeatureValueByCustomCustomer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.TextField(null=True,blank=True)
    value = models.TextField(null=True,blank=True)
    inner_template= models.ForeignKey(CustomTemplateField,on_delete=models.CASCADE,related_name="ExampleKeyFeatureValueByCustomCustomerTemplateId")
    outer_template= models.ForeignKey(CustomTemplate,on_delete=models.CASCADE,related_name="ExampleCustomTemplate",null=True,blank=True)

    def __str__(self):
        return str(self.key)+"  ( "+str(self.value) +" )"


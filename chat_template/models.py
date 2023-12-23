from django.db import models

# Create your models here.
from django.db import models
import uuid
from accounts.models import UserAccount
from chat.models import TimestampedModel

class ChatFirstTemplateModel(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_template_name = models.TextField(max_length=70,null=True,blank=True,unique=True)
    description = models.TextField(null=True,blank=True)
    trash = models.BooleanField(default=False,null=True,blank=True)

    def __str__(self):
        return str(self.chat_template_name)

    class Meta:
        verbose_name_plural = "Chat Template"


class ChatSecondStepTemplateModel(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_template_model= models.ForeignKey(ChatFirstTemplateModel,on_delete=models.CASCADE,related_name="chat_template_model_id")
    chat_first_step_template_name = models.TextField(max_length=70,null=True,blank=True,unique=True)
    description = models.TextField(null=True,blank=True)
    trash = models.BooleanField(default=False,null=True,blank=True)

    def __str__(self):
        instance=ChatFirstTemplateModel.objects.get(id=self.chat_template_model_id) 
        return str(instance.chat_template_name)+" -> "+str(self.chat_first_step_template_name)

    class Meta:
        verbose_name_plural = "Chat Fields Template"

class ChatThirdValueOfTemplateModel(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_template_model= models.ForeignKey(ChatSecondStepTemplateModel,on_delete=models.CASCADE,related_name="chat_first_step_template_id")
    value_of_prompt = models.TextField(null=True,blank=True,unique=True)
    description = models.TextField(null=True,blank=True)
    trash = models.BooleanField(default=False,null=True,blank=True)

    def __str__(self):
        return str(self.value_of_prompt)

    class Meta:
        verbose_name_plural = "Chat Template Value "

class CustomeChatTemplateOfUser(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="custome_user_template",null=True,blank=True)
    title = models.TextField(unique=True)
    description = models.TextField()
    trash = models.BooleanField(default=False,null=True,blank=True)

    def __str__(self):
        return "By : "+str(self.user_id)+" -> "+str(self.title)
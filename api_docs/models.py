from django.db import models
import uuid
from accounts.models import UserAccount
from chat.models import TimestampedModel
from template.models import Workspace


class ChatAPIContentModel(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,null=False,blank=True)
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE,related_name="chat_api_content_user_id",null=False,blank=True)
    workspace_id = models.ForeignKey(Workspace,on_delete=models.CASCADE,related_name="chat_api_content_workspace_id",null=False,blank=True)
    question = models.TextField(null=False,blank=True)
    content = models.TextField(null=False,blank=True)

    def __str__(self):
        return str(self.id)+ " : "+str(self.user_id)+ " : " + str(self.question)

    

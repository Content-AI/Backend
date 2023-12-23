from django.db import models
import uuid
from accounts.models import UserAccount
from projectsApp.models import Projects

class Brandvoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="user_brand_voice")
    brand_voice = models.TextField(max_length=30,null=True,blank=True)
    content = models.TextField()
    trash = models.BooleanField(default=False,null=True,blank=True)
    content_summarize = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "By : "+str(self.user_id)+ " , Title : " + str(self.content_summarize)
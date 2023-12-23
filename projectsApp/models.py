from django.db import models
import uuid
from accounts.models import UserAccount
import base64
from team_members.models import Workspace


class Projects(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="project_user_document",null=True,blank=True)
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="workspace_id_of_user_project",null=True,blank=True)
    project_name = models.TextField(max_length=30)
    trash = models.BooleanField(default=False,null=True,blank=True)
    favorite = models.BooleanField(default=False,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.user_id)+ " : " + str(self.project_name)

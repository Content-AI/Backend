from django.db import models
import uuid
from accounts.models import UserAccount
from projectsApp.models import Projects
import base64
from team_members.models import Workspace

class Documents(models.Model):
    STATUS_CHOICES=(
        ('Publish','Publish'),
        ('Draft','Draft'),
        ('Completed','Completed'),
        ('Pending','Pending'),
        ('Working','Working'),
        ('Urgent','Urgent'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="user_document")
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="project_id_for_document",null=True,blank=True)
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="workspace_id_of_user_doc",null=True,blank=True)
    title = models.TextField(max_length=30,null=True,blank=True)
    document_content = models.JSONField(default={}, null=True, blank=True)
    status =  models.CharField(max_length=10, choices=STATUS_CHOICES,default="Working",null=True,blank=True)
    favorite = models.BooleanField(default=False,null=True,blank=True)
    dislike = models.BooleanField(default=False,null=True,blank=True)
    like = models.BooleanField(default=False,null=True,blank=True)
    knowledge_base = models.BooleanField(default=False,null=True,blank=True)
    trash = models.BooleanField(default=False,null=True,blank=True)
    visible_by_workspace_member = models.BooleanField(default=False,null=True,blank=True)
    editable_by_workspace_member = models.ManyToManyField(UserAccount,null=True,blank=True, related_name='editable_workspaces')
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return "By : "+str(self.user_id)+ " , Title : " + str(self.title)
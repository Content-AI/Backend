from django.db import models
from accounts.models import UserAccount
import uuid



# Workspace is team
class Workspace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace_name = models.CharField(max_length=30,null=True,blank=True)
    admin_user_of_workspace = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='admin_teams')
    admin_or_not = models.BooleanField(default=True,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    # unique_link = models.ForeignKey(GenerateUniqueLinkForTeamMemberForInvitation, on_delete=models.CASCADE, related_name='unique_link',null=True,blank=True)
    # name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.workspace_name) + " :  " +str(self.admin_user_of_workspace.email)


class TeamMemberList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Workspace_Id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='workspace_members')
    workspace_name = models.CharField(max_length=40,null=True,blank=True)
    to_show_admin_user_email = models.CharField(max_length=40,null=True,blank=True)
    admin_or_not = models.BooleanField(default=True)
    second_layer_admin_or_not = models.BooleanField(default=False)
    team_member_user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='user_team_member')
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return str(self.Workspace_Id.workspace_name) + " :  " +str(self.team_member_user.email)+ " :  " +str(self.workspace_name)

class TeamMemberTeamNumber(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Workspace_Id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='workspace_members_team_number',null=True,blank=True)
    no_of_member = models.CharField(max_length=40,default=1,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return str(self.no_of_member) + " :  " +str(self.Workspace_Id)
    class Meta:
        verbose_name_plural = "Team Member Number"


class GenerateUniqueLinkForTeamMemberForInvitation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='workspace_members_invitation_link')
    unique_link_uuid= models.CharField(max_length=400)
    email=models.CharField(max_length=40)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    # admin_user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='link_admin_user')
    # invite_user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='invite_user_from_link')

    def __str__(self):
        return str(self.workspace_id.workspace_name) + " : " +str(self.email)
class InitialWorkShopOfUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='workspace_id_of_user')
    user_filter = models.ForeignKey(UserAccount,unique=True, on_delete=models.CASCADE, related_name='user_filter_id')
    owner_of_workspace = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='user_owner_of_workspace')
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return str(self.workspace_id.workspace_name) + " :  " +str(self.owner_of_workspace.email)

    class Meta:
        verbose_name_plural = "Add Workspace"

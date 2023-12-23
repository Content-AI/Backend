from template.times_convert import format_time_elapsed,updated_time_format
from rest_framework import serializers
from template.times_convert import format_time_month_day
from team_members.models import *
from accounts.models import UserAccount
from template.times_convert import *

from datetime import datetime, timezone


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ["id","email","first_name","last_name"]
    def to_representation(self, instance):
        representation={}
        # breakpoint()
        representation["id"]=instance.id
        representation["email"]=instance.email
        representation["first_name"]=instance.first_name
        representation["last_name"]=instance.last_name
        formatted_datetime = instance.created_at.strftime('%b %d, %Y')
        representation["created_at"]=formatted_datetime
        return representation

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMemberList
        fields = "__all__"

    def to_representation(self, instance):
        team_count=TeamMemberList.objects.filter(Workspace_Id=instance.Workspace_Id).count()
        representation = super().to_representation(instance)
        representation['team_member_user'] = UserAccountSerializer(instance.team_member_user).data
        representation['member_no'] = team_count
        if team_count==1:
            representation['team_member_count'] = str(team_count)+ " user"
        else:
            representation['team_member_count'] = str(team_count)+ " users"
        return representation

from documentsData.models import Documents

class UserDocsSerializer(serializers.ModelSerializer):
    editable_by_workspace_member = UserAccountSerializer(many=True)  # Serialize many-to-many field

    class Meta:
        model = Documents
        fields = ["user_id", "editable_by_workspace_member"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['email'] = instance.user_id.email
        representation['first_name'] = instance.user_id.first_name
        representation['last_name'] = instance.user_id.last_name
        representation['user_id'] = instance.user_id.id
        return representation


from team_members.models import GenerateUniqueLinkForTeamMemberForInvitation

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerateUniqueLinkForTeamMemberForInvitation
        fields = ['id', 'workspace_id', 'unique_link_uuid', 'email', 'created_at']

    def to_representation(self, instance):
        # representation = super().to_representation(instance)
        representation={}
        if instance.email != 'any_one':
            # representation['email'] = 'Via Link'
            representation["id"]=instance.id
            representation["email"]=instance.email        
            formatted_datetime = instance.created_at.strftime('%b %d, %Y')
            representation["created_at"]=formatted_datetime


        return representation
from django.urls import path
from team_members.views import team_subs_track,get_team_member_limit,remove_pending_invites,pending_invites,make_workshop_public,check_public_or_not,check_user_already_there_or_not,doc_shared_to_user,invite_with_email_share_doc,remove_member,change_permission,disable_invitation,generate_link_for_users,list_of_users_in_workshop,initial_work_shop_of_user,workspace_details,invite_to_workspace,accept_invitation,team_members_list

urlpatterns = [
    path('workspace/', workspace_details, name='workspace_details'),

    path('invite_to_workspace/', invite_to_workspace, name='invite_to_workspace'),

    path('generate_link_for_users/', generate_link_for_users, name='generate_link_for_users'),
    path('disable_invitation/', disable_invitation, name='disable_invitation'),
    path('accept_invitation/<str:data>', accept_invitation, name='accept_invitation'),

    path('team_members_list', team_members_list, name='team_members_list'),

    path('initial_work_shop_of_user', initial_work_shop_of_user, name='initial_work_shop_of_user'),
    path('list_of_users_in_workshop/<str:data>', list_of_users_in_workshop, name='list_of_users_in_workshop'),
    path('check_user_already_there_or_not/<str:data>', check_user_already_there_or_not, name='check_user_already_there_or_not'),
    path('change_permission/<str:data>', change_permission, name='change_permission'),
    path('remove_member/<str:data>', remove_member, name='remove_member'),
    path('invite_with_email_share_doc/', invite_with_email_share_doc, name='invite_with_email_share_doc'),
    path('doc_shared_to_user/<str:data>', doc_shared_to_user, name='doc_shared_to_user'),
    path('check_public_or_not/<str:data>', check_public_or_not, name='check_public_or_not'),
    path('make_workshop_public/<str:data>', make_workshop_public, name='make_workshop_public'),
    path('pending_invites/<str:data>', pending_invites, name='pending_invites'),
    path('remove_pending_invites/<str:data>', remove_pending_invites, name='remove_pending_invites'),
    
    path('get_team_member_limit', get_team_member_limit, name='get_team_member_limit'),
    
    path('team_subs_track', team_subs_track, name='team_subs_track'),
]

from django.shortcuts import render
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from team_members.models import Workspace,GenerateUniqueLinkForTeamMemberForInvitation,TeamMemberList
import uuid
from django.template.loader import render_to_string

from core.settings import FRONT_END_HOST


from accounts.models import UserAccount

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workspace_details(request):
    try:
        workspace_resp = Workspace.objects.filter(admin_user_of_workspace=request.user).values("id","workspace_name","admin_user_of_workspace","admin_or_not")
        return Response(workspace_resp, status=200)
    except:
        return Response({'message': 'workspace not created yet'}, status=400)

from dotenv import load_dotenv
load_dotenv()
import os
from datetime import datetime, timedelta, timezone


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_link_for_users(request):
    # try:
        # redirect_url = os.getenv('FRONT_END_HOST')
        redirect_url = FRONT_END_HOST
        workspace_id=request.GET.get('workspace_id')
        new=request.GET.get('new')
        if new=="no":
            try:
                wrk_ins = Workspace.objects.get(id=workspace_id)
                already_there=GenerateUniqueLinkForTeamMemberForInvitation.objects.get(email="any_one",workspace_id=wrk_ins)
                formatted_datetime = already_there.created_at.strftime('%b %d, %Y at %I:%M %p')
                new_datetime = already_there.created_at + timedelta(days=10)
                new_formatted_datetime = new_datetime.strftime('%b %d, %Y at %I:%M %p')
                return Response({"link":os.getenv('FRONT_END_HOST')+"/invitation/"+str(already_there.unique_link_uuid),"expire_time":new_formatted_datetime},status=200)
            except:
                return Response({"message":"no link"},status=400)
        elif new=="yes":
            if workspace_id is None or workspace_id=="":
                return Response({'message': 'workspace id needed'}, status=400)
            wrk_ins = Workspace.objects.get(id=workspace_id)
            # breakpoint()
            try:
                already_there=GenerateUniqueLinkForTeamMemberForInvitation.objects.get(email="any_one",workspace_id=wrk_ins)
                already_there.delete()
            except:
                pass
            ins_check_admin=TeamMemberList.objects.get(Workspace_Id=workspace_id,team_member_user=request.user)
            if ins_check_admin.admin_or_not:
                ins=GenerateUniqueLinkForTeamMemberForInvitation.objects.create(
                    unique_link_uuid=uuid.uuid4(),
                    email="any_one",
                    workspace_id=wrk_ins,
                )
                formatted_datetime = ins.created_at.strftime('%b %d, %Y at %I:%M %p')
                new_datetime = ins.created_at + timedelta(days=10)
                new_formatted_datetime = new_datetime.strftime('%b %d, %Y at %I:%M %p')
                return Response({"link":redirect_url+"/invitation/"+str(ins.unique_link_uuid),"expire_time":new_formatted_datetime},status=200)
            else:
                return Response({"message":"Contact admin"}, status=400)
        elif new=="delete":
                try:
                    workspace_id=request.GET.get('workspace_id')
                    wrk_ins = Workspace.objects.get(id=workspace_id)
                    already_there=GenerateUniqueLinkForTeamMemberForInvitation.objects.get(email="any_one",workspace_id=wrk_ins)
                    already_there.delete()
                    return Response({"message":"delete"},status=200)
                except:
                    return Response({"message":"delete"},status=200)
        else:
            return Response({"message":"need to generate link"}, status=400)
    # except:
    #     return Response({'message': 'Generate Link failed'}, status=400)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def disable_invitation(request):
    workspace_id=request.GET.get('workspace_id',None)
    wrk_ins = Workspace.objects.get(id=workspace_id)
    ins_check_admin=TeamMemberList.objects.get(Workspace_Id=workspace_id,team_member_user=request.user)
    if ins_check_admin.admin_or_not:
        return Response({"message":True}, status=200)
    else:
        return Response({"message":False}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_subs_track(request):
    ins_wrk=InitialWorkShopOfUser.objects.get(user_filter=request.user)    
    sub_ins=Subscription.objects.get(user_id=ins_wrk.owner_of_workspace)
    return Response({"sub_id":sub_ins.subscription_stripe_id}, status=200)


from subscriptions.models import Subscription
from subscriptions.models import SubscribedUser

from team_members.models import Workspace as WorkspaceModal,TeamMemberTeamNumber
from subscriptions.models import Subscription


@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def invite_to_workspace(request):
    if request.method == "POST":
        try:
            email_list = request.data.get("email")
            if not email_list:
                return Response({'message': 'Invitation failed'}, status=400)
            
            wrk_ins = Workspace.objects.get(id=request.data.get("workspace_id"))

            # get the user data

            ins_check_admin = TeamMemberList.objects.get(Workspace_Id=request.data.get("workspace_id"), team_member_user=request.user)
            
            ins_count=TeamMemberList.objects.filter(Workspace_Id=request.data.get("workspace_id"))
            

            try:
                # check the invitation to users limits
                check_team_member=TeamMemberTeamNumber.objects.get(Workspace_Id=request.data.get("workspace_id"))

                # sub_ins=Subscription.objects.get(user_id=ins_check_admin.id)

                check_team_member_already_joined=GenerateUniqueLinkForTeamMemberForInvitation.objects.filter(workspace_id=request.data.get("workspace_id"))
                check_member_number = TeamMemberList.objects.filter(Workspace_Id=wrk_ins)

                if int(check_team_member_already_joined.count())+check_member_number.count()>=int(check_team_member.no_of_member):
                    return Response({"message":"Buy more seat for team"},400)
            except Exception as e:
                print(str())
                pass

            if ins_check_admin.admin_or_not:
                invited_emails = []
                for user_email in email_list:
                    try:
                        statement = False
                        try:
                            user_ins = UserAccount.objects.get(email=user_email)
                            statement = TeamMemberList.objects.filter(team_member_user=user_ins, Workspace_Id=wrk_ins).exists()
                        except:
                            pass
                        if not statement:
                            if wrk_ins.admin_user_of_workspace.id == request.user.id:
                                ins = GenerateUniqueLinkForTeamMemberForInvitation.objects.create(
                                    unique_link_uuid=uuid.uuid4(),
                                    email=user_email,
                                    workspace_id=wrk_ins,
                                )

                                # redirect_url = os.getenv('FRONT_END_HOST')
                                redirect_url = FRONT_END_HOST

                                subject = 'Your Invitation'
                                template_name = 'invitation.html'
                                context = {'link_of_invitation': redirect_url + "/invitation/" + str(ins.unique_link_uuid)+"?invitation_code="+ str(ins.unique_link_uuid)}
                                email_content = render_to_string(template_name, context)
                                # print(f"sending email to {user_email}")
                                send_mail(
                                    subject,
                                    email_content,
                                    'test@gmail.com',
                                    [user_email],
                                    html_message=email_content,
                                    fail_silently=False
                                )
                                invited_emails.append(user_email)
                    except Exception as e:
                        # print(str(e))
                        pass
                
                if invited_emails:
                    return Response({"message": "Invitation sent to: " + ', '.join(invited_emails)}, status=200)
                else:
                    return Response({"message": "No new invitations sent"}, status=400)
            else:
                return Response({"message": "Contact admin"}, status=400)
        except Exception as e:
            return Response({"message": str(e)}, status=400)
    if request.method=="GET":
        try:
            wrk_ins = Workspace.objects.get(id=request.data.get("workspace_id"))
            statement=TeamMemberList.objects.filter(team_member_user=user_ins,Workspace_Id=wrk_ins).exists()
            if statement:
                return Response({'message': 'Already a member of workshop'}, status=400)
            
            if wrk_ins.admin_user_of_workspace.id==request.user.id:
                ins=GenerateUniqueLinkForTeamMemberForInvitation.objects.create(
                    unique_link_uuid=uuid.uuid4(),
                    email="all",
                    workspace_id=wrk_ins,
                )
                return Response({"message":"Invitation send"}, status=200)
            return Response({'message': 'Invitation failed'}, status=400)
        except:
            return Response({'message': 'Invitation failed'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def accept_invitation(request,data):
    # try:
        invitation_code=data
        if invitation_code is None:
            return Response({'message': 'Invitation failed'}, status=400)
        
        ins=GenerateUniqueLinkForTeamMemberForInvitation.objects.get(unique_link_uuid=invitation_code)
        wrk_ins=Workspace.objects.get(id=ins.workspace_id.id)

        statement=TeamMemberList.objects.filter(team_member_user=request.user,Workspace_Id=wrk_ins).exists()
        if statement:
            return Response({'message': 'Already a member of workshop'}, status=400)
        if ins.email=="any_one":
            TeamMemberList.objects.create(
                Workspace_Id=ins.workspace_id,
                workspace_name=wrk_ins.workspace_name,
                admin_or_not=False,
                to_show_admin_user_email=wrk_ins.admin_user_of_workspace.email,
                team_member_user=request.user
            )
            ins.delete()
            return Response({"message":"Invitation  accepted"}, status=200)
        if str(ins.email)==str(request.user.email):
            TeamMemberList.objects.create(
                Workspace_Id=ins.workspace_id,
                workspace_name=wrk_ins.workspace_name,
                admin_or_not=False,
                to_show_admin_user_email=wrk_ins.admin_user_of_workspace.email,
                team_member_user=request.user
            )
            ins.delete()
        return Response({"message":"Invitation  accepted"}, status=200)
        # return Response({'message': 'Invitation failed'}, status=400)
    # except:
    #     return Response({'message': 'Invitation failed'}, status=400)

from team_members.serializers import TeamMemberSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_permission(request,data):
    # breakpoint()
    try:
        ins_wrk=Workspace.objects.get(id=data)
        ins = TeamMemberList.objects.get(team_member_user=request.user,Workspace_Id=ins_wrk)
        # breakpoint()
        if ins.admin_or_not:
            id=request.data.get('id')
            change_per=request.data.get('perm')
            ins_update_user = TeamMemberList.objects.get(id=id,Workspace_Id=ins_wrk)
            ins_update_user.admin_or_not=change_per
            ins_update_user.save()
            return Response({'message': 'change permission'}, status=200)
        else:
            return Response({'message': 'Do not have permission'}, status=400)
    except:
        return Response({'message': 'something went wrong'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_member(request,data):
    # breakpoint()
    try:
        ins_wrk=Workspace.objects.get(id=data)
        #is admin or not checked
        ins = TeamMemberList.objects.get(team_member_user=request.user,Workspace_Id=ins_wrk)
        if ins.admin_or_not:
            id=request.data.get('id')
            ins_update_user = TeamMemberList.objects.get(id=id,Workspace_Id=ins_wrk)

            workspace_of_user=Workspace.objects.get(admin_user_of_workspace=ins_update_user.team_member_user)

            delete_data=InitialWorkShopOfUser.objects.get(user_filter=workspace_of_user.admin_user_of_workspace)
            delete_data.delete()
            InitialWorkShopOfUser.objects.create(workspace_id=workspace_of_user,user_filter=workspace_of_user.admin_user_of_workspace,owner_of_workspace=workspace_of_user.admin_user_of_workspace)
            # InitialWorkShopOfUser.objects.create(workspace_id=workspace_of_user,user_filter=workspace_of_user.admin_user_of_workspace)
            ins_update_user.delete()
            return Response({'message': 'User remove'}, status=200)
        else:
            return Response({'message': 'Do not have permission'}, status=400)
    except Exception as e:
        return Response({'message': str(e)}, status=400)


from documentsData.models import Documents
from accounts.models import UserAccount
from django.core.mail import send_mail
import os
from dotenv import load_dotenv

load_dotenv()

from django.template.loader import render_to_string
from core.settings import FRONT_END_HOST as FRONT_END_HOST_LINK

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invite_with_email_share_doc(request):
    try:
        document_id=request.data.get('document_id')
        doc_ins=Documents.objects.get(id=document_id)
        for data in request.data.get('email'):
            # breakpoint()
            try:
                ins_user=UserAccount.objects.get(email=data)
                req_ins_user=UserAccount.objects.get(email=request.user)
                if TeamMemberList.objects.filter(Workspace_Id=doc_ins.workspace_id,team_member_user=ins_user).exists():
                    doc_ins.editable_by_workspace_member.add(ins_user)
                    return_portal = FRONT_END_HOST_LINK
                    link=FRONT_END_HOST_LINK+"/template_data/"+document_id
                    subject = 'Shared Docx link'
                    template_name = 'share_doc.html'
                    context = {'link': str(link),'name':str(req_ins_user.first_name)+str(req_ins_user.last_name)}
                    email_content = render_to_string(template_name, context)
                    send_mail(
                        subject,
                        email_content,
                        'test@gmail.com',
                        [data],
                        html_message=email_content,
                        fail_silently=False
                    )
                    # return Response({'link': link}, status=200)
                    return Response({'message': 'User Invited'}, status=200)
                else:
                    # return Response({'message': 'Not a member of workspace'}, status=400)
                    pass
            except:
                pass
    except:
        return Response({'message': 'something went wrong'}, status=400)
    return Response({'message': 'something went wrong'}, status=400)


from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_members_list(request):
    try:
        search_query = request.GET.get('search', '')
        ins = TeamMemberList.objects.filter(
            Q(team_member_user=request.user),
            Q(workspace_name__icontains=search_query) |
            Q(team_member_user__first_name__icontains=search_query) |
            Q(team_member_user__last_name__icontains=search_query) |
            Q(team_member_user__email__icontains=search_query)
        )
        serializer = TeamMemberSerializer(ins, many=True)
        return Response(serializer.data, status=200)
    except:
        return Response({'message': 'something went wrong'}, status=400)


from team_members.serializers import InvitationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_invites(request,data):
    try:
        queryset = GenerateUniqueLinkForTeamMemberForInvitation.objects.filter(workspace_id=data)
        serializer = InvitationSerializer(queryset, many=True)
        data=serializer.data
        filtered_data = [item for item in data if any(item.values())]
        return Response(filtered_data,200)
    except:
        return Response({'message': 'something went wrong'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def remove_pending_invites(request,data):
    try:
        queryset = GenerateUniqueLinkForTeamMemberForInvitation.objects.get(id=data)
        queryset.delete()
        return Response({"message":"removed"},200)
    except Exception as e:
        return Response({'message': str(e)}, status=400)


from team_members.models import InitialWorkShopOfUser

@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def initial_work_shop_of_user(request):
    if request.method=="POST":
        # save the id and return data
        id=request.data.get('id')
        if id is not None:
            try:
                ins_user=InitialWorkShopOfUser.objects.get(user_filter=request.user)
                ins_user.delete()
            except:
                pass
            ins_work=Workspace.objects.get(id=id)
            ins=InitialWorkShopOfUser.objects.create(workspace_id=ins_work,user_filter=request.user,owner_of_workspace=ins_work.admin_user_of_workspace)
            # ins=InitialWorkShopOfUser.objects.create(workspace_id=ins_work,user_filter=request.user)
            ins = TeamMemberList.objects.filter(Workspace_Id=ins.workspace_id,team_member_user=request.user)
            serializer = TeamMemberSerializer(ins,many=True)
        return Response(serializer.data, status=200)
    if request.method=="GET":
        # breakpoint()
        ins_init=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        ins = TeamMemberList.objects.filter(Workspace_Id=ins_init.workspace_id,team_member_user=request.user)
        serializer = TeamMemberSerializer(ins,many=True)
        return Response(serializer.data, status=200)
    return Response({'message': 'something went wrong'}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_of_users_in_workshop(request,data):
    try:
        search_query = request.GET.get('search', '')
        ins = TeamMemberList.objects.filter(
            Q(Workspace_Id=data),
            Q(workspace_name__icontains=search_query) |
            Q(team_member_user__first_name__icontains=search_query) |
            Q(team_member_user__last_name__icontains=search_query) |
            Q(team_member_user__email__icontains=search_query)
        )
        serializer = TeamMemberSerializer(ins, many=True)

        serializer = TeamMemberSerializer(ins, many=True)
        tmp_data=serializer.data
        request_user_email =request.user.email   # Replace this with the actual request user's email
        # Separate entries that match the request user's email from those that don't
        matching_entries = []
        other_entries = []

        for entry in tmp_data:
            if entry["team_member_user"]["email"] == request_user_email:
                matching_entries.append(entry)
            else:
                other_entries.append(entry)

        # Combine the matching entries at the top and other entries below
        new_tmp_data = matching_entries + other_entries

        return Response(new_tmp_data, status=200)
    except:
        return Response({'message': 'something went wrong'}, status=400)


from documentsData.models import Documents
from team_members.serializers import UserDocsSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doc_shared_to_user(request,data):
    try:
        search_query = request.GET.get('search', '')
        ins = Documents.objects.filter(
            Q(id=data),
            Q(user_id__first_name__icontains=search_query) |
            Q(user_id__last_name__icontains=search_query) |
            Q(user_id__email__icontains=search_query)
        )
        serializer = UserDocsSerializer(ins, many=True)
        return Response(serializer.data, status=200)
    except:
        return Response({'message': 'something went wrong'}, status=400)
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_user_already_there_or_not(request,data):
    try:
        # breakpoint()
        doc_ins=Documents.objects.get(id=data)
        ins_user=UserAccount.objects.get(email=request.data.get('email'))
        # if Documents.objects.filter(workspace_id=doc_ins.workspace_id,editable_by_workspace_member=ins_user).exists():
        #     return Response({'message': 'ALready shared'}, status=400)
        return Response({"message":"can invite"}, status=200)
    except:
        return Response({'message': 'User not a member of workspace'}, status=400)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_public_or_not(request,data):
    try:
        doc_ins=Documents.objects.get(id=data)
        if doc_ins.visible_by_workspace_member:
            return Response({'message':doc_ins.visible_by_workspace_member}, status=200)
        else:
            return Response({'message':doc_ins.visible_by_workspace_member}, status=400)
    except:
        return Response({'message': 'something went wrong'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_workshop_public(request,data):
    try:
        doc_ins=Documents.objects.get(id=data)
        doc_ins.visible_by_workspace_member=request.data.get("make")
        doc_ins.save()
        return Response({'message':doc_ins.visible_by_workspace_member}, status=200)
    except:
        return Response({'message': 'something went wrong'}, status=400)

from team_members.models import TeamMemberTeamNumber

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_team_member_limit(request):
    try:
        ins_wrk=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        limit_of_user=TeamMemberTeamNumber.objects.get(Workspace_Id=ins_wrk.workspace_id)
        return Response({"data":limit_of_user.no_of_member},200)
    except Exception as e:
        return Response({'message': str(e)}, status=400)


# check_subscription.py

from django.http import JsonResponse
from functools import wraps
from accounts.models import UserAccount
from subscriptions.models import Subscription

from datetime import datetime, timedelta
from django.utils import timezone
from team_members.models import Workspace,InitialWorkShopOfUser
from accounts.models import GenerateWordRestrictionForUser

def restrict_user(original_func):
    @wraps(original_func)
    def wrapper(request, *args, **kwargs):
        data={"restrict_user": True}
        ins_workspace=InitialWorkShopOfUser.objects.get(user_filter=request.user)
        try:
            instance = Subscription.objects.get(user_id=ins_workspace.owner_of_workspace)
            user_manipulate_token=instance.user_id

            if instance.status=="trail":
                # check the trail period and if it expires then make restrict_user to True
                if instance.trail_ends:
                    current_date = timezone.now().date()
                    difference = instance.trail_ends.date() - current_date
                    difference.days
                    if difference.days<=0:
                        instance = Subscription.objects.get(user_id=request.user)
                        instance.status="trial"
                        instance.restrict_user = True
                        instance.save()
                        return JsonResponse(data, status=400)
            # if instance.status=="active":
                # check the start and end data

        except:
            return JsonResponse(data, status=400)
        if instance.restrict_user:
            return JsonResponse(data, status=400)
        else:
            pass
        return original_func(request, *args, **kwargs)
    return wrapper
def restrict_user_views(user):
    try:
        ins_workspace=InitialWorkShopOfUser.objects.get(user_filter=user)
        instance = Subscription.objects.get(user_id=ins_workspace.owner_of_workspace)
        # instance = Subscription.objects.get(user_id=user)
    except:
        return False
    return True

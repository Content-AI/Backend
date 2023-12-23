from rest_framework.response import Response
from accounts.models import UserApiKey
from functools import wraps
from subscriptions.models import SubscribedUser,Subscription
from team_members.models import InitialWorkShopOfUser
from functools import wraps


def log_request_user_with_api_key(view_func):
    def log_and_call_view(view, request, *args, **kwargs):
        # You can add your custom logic here to determine the response
        if request.META.get("HTTP_API_KEY", None) is None:
            return Response({"message": "Missing Api-Key"}, status=403)
        try:
            user_instance = UserApiKey.objects.get(api_key=request.META.get("HTTP_API_KEY"))
        except UserApiKey.DoesNotExist:
            return Response({"message": "Invalid APi-Key"}, status=403)
        
        if user_instance.user:
            # check the subscription plan
            wrk_ins = InitialWorkShopOfUser.objects.get(user_filter=user_instance.user)
            ins_subs = Subscription.objects.get(user_id=wrk_ins.owner_of_workspace)
            # only premium users can use the API using API keys
            if ins_subs.status == "active" and ins_subs.plan == "premium":
                return view_func(view, request, ins_subs.user_id, *args, **kwargs)
        
        return Response({"message": "Upgrade Your plan"}, status=403)

    return log_and_call_view

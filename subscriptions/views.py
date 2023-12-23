# api/views.py
from subscriptions.check_subscription import restrict_user
from functools import wraps
from datetime import datetime, timedelta
from subscriptions.models import Subscription
from accounts.models import UserAccount
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.http import JsonResponse
from accounts.models import GenerateWordRestrictionForUser
from rest_framework.decorators import api_view
import stripe

import os
from dotenv import load_dotenv
load_dotenv()

from core.settings import FRONT_END_HOST

from datetime import datetime, timedelta
from django.utils import timezone

from team_members.models import Workspace,InitialWorkShopOfUser

from core.settings import stripe_production
from core.settings import stripe_key as stripe_key_set
from core.settings import get_price_id

# if stripe_production:
#     stripe_key=stripe_key_set
#     # stripe_key="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"
#     # stripe.api_key="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"
# else:
#     stripe_key=stripe_key_set
#     # stripe_key = 'sk_test_51NZTCUD0PMGPSuj4SY0Mqqmuy1YkOHa4YFFlHFqaphXE6vdhcCJKtyqsKJ9Wzy10acbth3pUlb04HfzYB2ucvAGg00emcxaUJD'
#     # stripe.api_key = 'sk_test_51NZTCUD0PMGPSuj4SY0Mqqmuy1YkOHa4YFFlHFqaphXE6vdhcCJKtyqsKJ9Wzy10acbth3pUlb04HfzYB2ucvAGg00emcxaUJD'




@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def first_create_account_stripe_app_create_session(request):
    user_id = request.user.id
    monthly_annually = request.data.get('subscription_type')
    subscription_type=monthly_annually
    status = "trial"
    plan = request.data.get('plan')
    if not user_id or not plan or not status or not monthly_annually:
        return JsonResponse({'error': 'User ID ,subscription_type and plan are required.'}, status=400)
    # redirect_url = os.getenv('FRONT_END_HOST')
    # breakpoint()
    redirect_url = FRONT_END_HOST

    price_id=None
    price_id=get_price_id(plan,monthly_annually)
    if price_id is None:
        return JsonResponse({'message': "price not define"}, status=400)

    user = UserAccount.objects.get(pk=request.user.id)
    instance_sub_check = Subscription.objects.filter(user_id=user).exists()
    if instance_sub_check:
        instance_sub_user = Subscription.objects.get(user_id=user)
        plan=instance_sub_user.subscription_type
        customer_stripe_id=instance_sub_user.customer_stripe_id
        session = stripe.checkout.Session.create(
                customer=instance_sub_user.customer_stripe_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                # subscription_data={
                #     # Set the trial period duration (14 days in this case)
                #     'trial_period_days': 14,
                # },
                success_url=f'{redirect_url}/success/?message=success',
                cancel_url=f'{redirect_url}/cancel/?message=cancel',
            )
        return JsonResponse({'message': session}, status=200)
    else:
        try:
            customer = stripe.Customer.create(
                email=user.email,
            )

            instance = Subscription.objects.create(
                user_id=user,
                customer_stripe_id=customer.id,
                email=user.email,
                plan=plan,
                subscription_type=subscription_type,
                status=status,
                started_at= timezone.now(),
            )
            trail_ends = instance.started_at + timedelta(days=14)
            instance_update=Subscription.objects.get(id=instance.id)
            instance_update.trail_ends=trail_ends
            instance_update.save()

            plan=instance.subscription_type

            session = stripe.checkout.Session.create(
                customer=instance.customer_stripe_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                # subscription_data={
                #     # Set the trial period duration (7 days in this case)
                #     'trial_period_days': 14,
                # },
                success_url=f'{redirect_url}/success/?message=success',
                cancel_url=f'{redirect_url}/cancel/?message=cancel',
            )
            return JsonResponse({'message': session}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(Exception)}, status=400)
    return JsonResponse({'message': "status need trail , monthly , annaully ?? "}, status=400)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def direct_create_account_stripe_app_create_session(request):
    try:
        instance_user = Subscription.objects.get(user_id=request.user.id)
        plan = request.data.get('plan',None)
        monthly_annually = request.data.get('monthly_annually',None)
        if not plan or not monthly_annually:
            return JsonResponse({'error': 'monthly_annually and plan is required.'}, status=400)
        
        a="direct_create_account_stripe_app_create_session"

        # check the user is already subscribe or not if yes then stop in subscribing and send the month or year
        try:
            user = UserAccount.objects.get(pk=request.user.id)
            instance_sub_check = Subscription.objects.get(user_id=user)
            if instance_sub_check.status=="active":

                # Calculate the difference in years and months
                years_diff = instance_sub_check.end_at.year - instance_sub_check.started_at.year
                months_diff = instance_sub_check.end_at.month - instance_sub_check.started_at.month

                # If months_diff is negative, adjust it by adding 12 months to it and decrementing years_diff
                if months_diff < 0:
                    years_diff -= 1
                    months_diff += 12

                if years_diff > 0:
                    if months_diff > 0:
                        return JsonResponse({'message': "You already subscribe","time":f"{years_diff} years and {months_diff} months"}, status=400)
                    else:
                        return JsonResponse({'message': "You already subscribe","time":f"{years_diff} years"}, status=400)
                elif months_diff > 0:
                    return JsonResponse({'message': "You already subscribe","time":f"{months_diff} months"}, status=400)
                else:
                    pass
        except Exception as e:
            pass

        # redirect_url = os.getenv('FRONT_END_HOST')
        redirect_url = FRONT_END_HOST

        price_id=None
        price_id=get_price_id(plan,monthly_annually)
        # breakpoint()
        if price_id is None:
            return JsonResponse({'message': "price not define"}, status=400)
        if price_id is not None:
            session = stripe.checkout.Session.create(
                customer=instance_user.customer_stripe_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=f'{redirect_url}/success/?message=success',
                cancel_url=f'{redirect_url}/cancel/?message=cancel',
            )
            return JsonResponse({'message': session}, status=200)
        else:
            return JsonResponse({'message': "something went wrong"}, status=400)
    except stripe.error.CardError as e:
        return JsonResponse({'error': str(e)}, status=400)


from subscriptions.models import TeamMemberPrice

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def direct_create_team_seat_stripe_app_create_session(request):
    try:
        if stripe_production:
            price_id="price_1O7II1D0PMGPSuj4qDIlvZOH"
        else:
            price_id="price_1NkpiID0PMGPSuj43MlPoEN1"
        instance_user = Subscription.objects.get(user_id=request.user.id)
        price_from_db=TeamMemberPrice.objects.filter(id=1).values("price_per_seat")
        no_of_seats = request.data.get('no_of_seats',None)
        price_of_seat=int(price_from_db[0]["price_per_seat"])*int(no_of_seats)

        redirect_url = FRONT_END_HOST

        if price_of_seat is not None:
            session = stripe.checkout.Session.create(
                customer=instance_user.customer_stripe_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': int(no_of_seats),
                }],
                mode='subscription',
                success_url=f'{redirect_url}/success/?message=success',
                cancel_url=f'{redirect_url}/cancel/?message=cancel',
            )
            return JsonResponse(session, status=200)
        else:
            return JsonResponse({'message': "something went wrong"}, status=400)
    except stripe.error.CardError as e:
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    if request.method=="POST":
        # breakpoint()
        return JsonResponse({'message': 'Thank you for you feedback'},status=200)
    if request.method=="GET":
        # breakpoint()
        try:
            # Fetch the subscription from Stripe
            user_instance=Subscription.objects.get(user_id=request.user)
            user_instance.subscription_stripe_id
            subscription = stripe.Subscription.retrieve(user_instance.subscription_stripe_id)

            # Cancel the subscription at the end of the current billing period
            if subscription.trial_start is not None:
                    subscription.cancel(prorate=False)
                    return JsonResponse({'message': 'Subscription canceled successfully.'},status=200)
            elif subscription.status == 'canceled':
                return JsonResponse({'error': "Subscription cancel already"}, status=400)
            else:
                subscription.cancel()
                return JsonResponse({'message': 'Subscription canceled successfully.'},status=200)
        except stripe.error.StripeError as e:
            return JsonResponse({'error': str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def create_invoice_portal_session(request):
    try:
        # Replace 'CUSTOMER_ID' with the ID of the customer you want to create the session for
        # For example, you could retrieve the customer ID from the request or your database
        instance=Subscription.objects.get(user_id=request.user)        
        # Create the invoice portal session
        redirect_url = FRONT_END_HOST
        session = stripe.billing_portal.Session.create(
            customer=instance.customer_stripe_id,
            return_url=f'{redirect_url}/settings/general?page=billing',  # Replace with your desired return URL
        )
        # breakpoint()
        # Redirect the user to the Stripe hosted invoice portal URL
        # return redirect(session.url)
        return Response({'message':session.url}, status=200)
    
    except stripe.error.StripeError as e:
        # Handle any Stripe API errors
        return Response({'error': str(e)}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_invoices_for_customer(request):
    try:
        instance=Subscription.objects.get(user_id=request.user)
        invoices = stripe.Invoice.list(customer=instance.customer_stripe_id)
        invoice_data = []
        for invoice in invoices['data']:
            invoice_data.append({
                'id': invoice['id'],
                'amount_due': invoice['amount_due'],
                'status': invoice['status'],
                'created': invoice['created'],
                # Add other relevant fields as needed
            })
        return Response(invoice)

    except stripe.error.StripeError as e:
        return Response({'error': str(e)}, status=400)


from core.settings import endpoint_secret_key
from team_members.models import Workspace as WorkspaceModal,TeamMemberTeamNumber
from subscriptions.models import Subscription
from team_members.models import Workspace,TeamMemberTeamNumber

from core.settings import monthly_starter_production,annually_starter_production,monthly_premium_production,annually_premium_production
from core.settings import per_seat_product



@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    total_words_for_premium=1000000
    total_words_for_trail=2000
    # print(payload)
    event = None
    endpoint_secret = endpoint_secret_key

    try:
        # Verify the webhook event using your Stripe secret key
        event = stripe.Webhook.construct_event(
            payload, request.headers.get(
                'Stripe-Signature'), endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return JsonResponse({'error': 'Invalid signature'}, status=400)


    # Handle the event based on its type
    if event.type == 'customer.subscription.updated':
        customer_stripe_id=request.data["data"]["object"]["customer"]
        instance = Subscription.objects.get(customer_stripe_id=customer_stripe_id)
        # try:
        # print("===============customer.subscription.updated=================")
        # print(request.data)
        plan=None
        annually_monthly=None
        if request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==annually_starter_production:
            print("annually starter")
            instance.restrict_user = False
            instance.subscription_type="annually"
            instance.plan="starter"
            instance.status="active"
            # instance = Subscription.objects.get(customer_stripe_id=customer.id)
            user_manipulate_token=instance.user_id
            # ================add days==========================================
            instance.started_at = timezone.now()
            end_at = instance.started_at + timedelta(days=365)
            instance.end_at = end_at
            print("annually starter")

            # save token for version
            generate_instance=GenerateWordRestrictionForUser.objects.get(user=user_manipulate_token)
            generate_instance.words=total_words_for_premium
            generate_instance.save()



            # add the team member but if there is 3 or more then 3 then do nothing
            customer_stripe_id=request.data["data"]["object"]["customer"]
            cus_stripe_ins=Subscription.objects.get(customer_stripe_id=customer_stripe_id)
            wrk_stripe_ins=WorkspaceModal.objects.get(admin_user_of_workspace=cus_stripe_ins.user_id)
            TeamMemberTeamNumber.objects.create(Workspace_Id=wrk_stripe_ins,no_of_member=1)

            # ================add days==========================================
            instance.subscription_stripe_id=request.data["data"]["object"]["id"]

        elif request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==monthly_starter_production:
            print("monthly starter")
            instance.subscription_type="monthly"
            instance.plan="starter"
            instance.status="active"
            # ================add days==========================================
            instance.started_at = timezone.now()
            end_at = instance.started_at + timedelta(days=30)
            instance.end_at = end_at

            user_manipulate_token=instance.user_id
            # save token for trail version
            generate_instance=GenerateWordRestrictionForUser.objects.get(user=user_manipulate_token)
            generate_instance.words=total_words_for_premium
            generate_instance.save()

            # add the team member but if there is 3 or more then 3 then do nothing
            customer_stripe_id=request.data["data"]["object"]["customer"]
            cus_stripe_ins=Subscription.objects.get(customer_stripe_id=customer_stripe_id)
            wrk_stripe_ins=WorkspaceModal.objects.get(admin_user_of_workspace=cus_stripe_ins.user_id)
            TeamMemberTeamNumber.objects.create(Workspace_Id=wrk_stripe_ins,no_of_member=1)

            # ================add days==========================================
            instance.subscription_stripe_id=request.data["data"]["object"]["id"]        
        elif request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==monthly_premium_production:
            print("monthly premium")
            instance.subscription_type="monthly"
            instance.plan="premium"
            instance.status="active"
            # ================add days==========================================
            instance.started_at = timezone.now()
            end_at = instance.started_at + timedelta(days=30)
            instance.end_at = end_at

            user_manipulate_token=instance.user_id
            # save token for trail version
            generate_instance=GenerateWordRestrictionForUser.objects.get(user=user_manipulate_token)
            generate_instance.words=total_words_for_premium
            generate_instance.save()

            # add the team member but if there is 3 or more then 3 then do nothing
            customer_stripe_id=request.data["data"]["object"]["customer"]
            cus_stripe_ins=Subscription.objects.get(customer_stripe_id=customer_stripe_id)
            wrk_stripe_ins=WorkspaceModal.objects.get(admin_user_of_workspace=cus_stripe_ins.user_id)
            TeamMemberTeamNumber.objects.create(Workspace_Id=wrk_stripe_ins,no_of_member=3)


            # ================add days==========================================
            instance.subscription_stripe_id=request.data["data"]["object"]["id"]
        elif request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==annually_premium_production:
            print("yearly premium")
            instance.subscription_type="annually"
            instance.plan="premium"
            instance.status="active"
            # ================add days==========================================
            instance.started_at = timezone.now()
            end_at = instance.started_at + timedelta(days=365)
            instance.end_at = end_at

            user_manipulate_token=instance.user_id
            # save token for trail version
            generate_instance=GenerateWordRestrictionForUser.objects.get(user=user_manipulate_token)
            generate_instance.words=total_words_for_premium
            generate_instance.save()
            # ================add days==========================================
            instance.subscription_stripe_id=request.data["data"]["object"]["id"]
        instance.save()
        if request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==per_seat_product:

            # try:
            # Extracting the unit_amount and quantity from the JSON
            unit_amount_in_cents = request.data["data"]["object"]["items"]["data"][0]["price"]["unit_amount"]
            quantity = request.data["data"]["object"]["items"]["data"][0]["quantity"]
            # Calculating the total seats from stripe and team_member_no models
            wrk_ins=Workspace.objects.get(admin_user_of_workspace=instance.user_id)
            ins_team_member_no=TeamMemberTeamNumber.objects.get(Workspace_Id=wrk_ins)
            ins_team_member_no.no_of_member=int(ins_team_member_no.no_of_member)+int(quantity)
            ins_team_member_no.save()

            instance_sub_user = Subscription.objects.get(user_id=instance.user_id)
            instance_sub_user.subscription_team_stripe_id=request.data["data"]["object"]["id"]
            instance_sub_user.save()
            
            #     print("============customer.subscription.updated====================")
            # except Exception as e:
            #     print(str(e))
    else:
        if event.type == 'customer.subscription.created':
            # try:
            print("====================customer.subscription.created==========================")
            print(request.data)
            print("======================customer.subscription.created========================")
            customer_stripe_id=request.data["data"]["object"]["customer"]
            instance = Subscription.objects.get(customer_stripe_id=customer_stripe_id)
            if instance.status=="trial":

                # get the data of plan from strip production id
                if request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==annually_starter_production:
                    instance.subscription_type="annually"
                    instance.plan="starter"
                elif request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==monthly_starter_production:
                    instance.subscription_type="monthly"
                    instance.plan="starter"
                elif request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==monthly_premium_production:
                    instance.subscription_type="monthly"
                    instance.plan="premium"
                elif request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]==annually_premium_production:
                    instance.subscription_type="annually"
                    instance.plan="premium"
                instance.restrict_user = False
                instance.subscription_stripe_id=request.data["data"]["object"]["id"]
                user_manipulate_token=instance.user_id
                instance.save()
                product_id = request.data["data"]["object"]["items"]["data"][0]["plan"]["product"]

                # save token for trail version
                generate_instance=GenerateWordRestrictionForUser.objects.get(user=user_manipulate_token)
                generate_instance.words=total_words_for_trail
                generate_instance.save()

                # get the subscription data as premium or not if premium then add 3 members.
                cus_stripe_ins=Subscription.objects.get(customer_stripe_id=customer_stripe_id)
                wrk_stripe_ins=WorkspaceModal.objects.get(admin_user_of_workspace=cus_stripe_ins.user_id)
                try:
                    if cus_stripe_ins.plan=="premium":
                        count_team_member=TeamMemberTeamNumber.objects.filter(Workspace_Id=wrk_stripe_ins).exists()
                        if count_team_member:
                            check_count_team_member=TeamMemberTeamNumber.objects.filter(Workspace_Id=wrk_stripe_ins).values('no_of_member')
                            team_member_count = check_count_team_member[0]["no_of_member"]
                            if team_member_count < 3:
                                no_of_member = 1 if subscription_data['data']['object']['status'] == 'trialing' else 3
                                TeamMemberTeamNumber.objects.create(Workspace_Id=wrk_stripe_ins, no_of_member=no_of_member)
                except Exception as e:
                    # print("===error==")
                    # print(str(e))
                    # print("===error==")
                    pass
            # except:
            #     pass
    if event.type == 'customer.subscription.deleted':
            print("====================customer.subscription.deleted==========================")
            # print(request.data)
            print("======================customer.subscription.deleted========================")
            customer_stripe_id=request.data["data"]["object"]["customer"]
            instance = Subscription.objects.get(customer_stripe_id=customer_stripe_id)
            if request.data["data"]["object"]["trial_start"] is None:
                pass
            else:
                instance.status="trial"
                instance.end_at=None
                instance.subscription_stripe_id=request.data["data"]["object"]["id"]
                user_manipulate_token=instance.user_id
                instance.save()
                # save token for trail version
                generate_instance=GenerateWordRestrictionForUser.objects.get(user=user_manipulate_token)
                generate_instance.words=total_words_for_trail
                generate_instance.save()


    return JsonResponse({'status': 'success'}, status=200)


from subscriptions.check_subscription import restrict_user
from subscriptions.models import Subscription,SubscriptionMoney

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@restrict_user
def subscribe_check(request):
    data={"restrict_user": True}
    ins_workspace=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    instance = Subscription.objects.filter(user_id=ins_workspace.owner_of_workspace).values('restrict_user','customer_stripe_id','email','subscription_type','status')
    # instance = Subscription.objects.filter(user_id=request.user).values('restrict_user','customer_stripe_id','email','subscription_type','status')
    # try:
    restrict_user_data = request
    # except:
    #     return JsonResponse(data, status=400)

    return JsonResponse(instance.first(), status=200)


from datetime import datetime
from subscriptions.models import SubscriptionMoney
from django.utils import timezone


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@restrict_user
def subcription_details(request):
    data = {"restrict_user": True}

    ins_workspace=InitialWorkShopOfUser.objects.get(user_filter=request.user)
    instance = Subscription.objects.filter(user_id=ins_workspace.owner_of_workspace).values("customer_stripe_id", "email", "subscription_type", "plan", "status").first()
    
    # Get the started_at and trail_ends dates from the instance
    instance_charge = SubscriptionMoney.objects.all()
    data = {}
    # breakpoint()
    if instance["status"]=="trial":
        instance = Subscription.objects.filter(user_id=ins_workspace.owner_of_workspace).values("customer_stripe_id", "email", "subscription_type", "plan", "status", "started_at", "trail_ends").first()
        trail_ends = instance["trail_ends"]

        # Check  trail_ends are in string format and convert them to datetime objects
        if isinstance(trail_ends, str):
            trail_ends = datetime.strptime(trail_ends, "%Y-%m-%dT%H:%M:%S.%fZ")
        # breakpoint()

        # Calculate the difference between trail_ends dates
        if trail_ends:
            current_date = timezone.now().date()
            difference = trail_ends.date() - current_date
            instance["trail_ends"] = f"{difference.days} days"

        else:
            instance["trail_ends"] = None
    else:
        instance = Subscription.objects.filter(user_id=ins_workspace.owner_of_workspace).values("customer_stripe_id", "email", "subscription_type", "plan", "status","started_at","end_at").first()
        formatted_datetime = instance["end_at"].strftime("%d %b %Y")
    # try:
    restrict_user_data = request
    # except:
    #     return JsonResponse(data, status=400)

    monthly_starter=instance_charge[0].monthly_starter
    monthly_premium_mode=instance_charge[0].monthly_premium_mode
    annaully_starter=instance_charge[0].annaully_starter
    annaully_premium_mode=instance_charge[0].annaully_premium_mode
    

    data["charge_description"]={}
    data["charge_description"]["monthly_starter"]=monthly_starter
    data["charge_description"]["monthly_premium_mode"]=monthly_premium_mode
    data["charge_description"]["annaully_premium_mode"]=annaully_premium_mode
    data["charge_description"]["annaully_starter"]=annaully_starter
    

    data["user"]=instance
    try:
        data["user"]["date_to_end_subs"]=formatted_datetime
    except:
        pass

    return JsonResponse(data, status=200)




from rest_framework.response import Response
@api_view(['GET'])
def charge(request):
    instance = SubscriptionMoney.objects.all().values("monthly_starter","monthly_premium_mode","annaully_starter","annaully_premium_mode")
    return Response(instance, status=200)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def times_remaining(request):
    resp={}
    SubscriptionInstance = Subscription.objects.filter(user_id=request.user).values('trail_ends','started_at','end_at')
    if SubscriptionInstance[0]["trail_ends"] is not None:
        times_remaining_trail=SubscriptionInstance[0]["trail_ends"]
        formatted_datetime_trail = times_remaining_trail.strftime('%b %d, %Y')
        resp["trail_ends"]=formatted_datetime_trail
    if SubscriptionInstance[0]["started_at"] is not None:
        times_remaining_start=SubscriptionInstance[0]["started_at"]
        formatted_datetime_start = times_remaining_start.strftime('%b %d, %Y')
        resp["started_at"]=formatted_datetime_start
    if SubscriptionInstance[0]["end_at"] is not None:
        times_remaining_end=SubscriptionInstance[0]["end_at"]
        formatted_datetime_end = times_remaining_end.strftime('%b %d, %Y')
        resp["end_at"]=formatted_datetime_end
    return Response(resp, status=200)
    



# views.py
from django.http import JsonResponse
import stripe
def get_total_subscribers(request):
    # ins = Subscription.objects.filter(status="active").count()
    subscribed_customers = stripe.Customer.list()
    count = 0
    for customer in subscribed_customers.auto_paging_iter():
        customer_subscriptions = stripe.Subscription.list(customer=customer.id)
        for subscription in customer_subscriptions.auto_paging_iter():
            if subscription.status == "active":
                # print(subscription.status)
                # print(subscription)
                # breakpoint()
                count += 1
    return JsonResponse({'subscribed_users_count': count},status=200)

def get_trail_total_subscribers(request):
    subscribed_customers = stripe.Customer.list()
    count = 0
    for customer in subscribed_customers.auto_paging_iter():
        customer_subscriptions = stripe.Subscription.list(customer=customer.id)
        for subscription in customer_subscriptions.auto_paging_iter():
            if subscription.status == "trialing":
                count += 1
    return JsonResponse({'subscribed_trail_users_count': count})


def subscribed_users_details(request):
    subscribed_customers = stripe.Customer.list()
    details = []

    for customer in subscribed_customers.auto_paging_iter():
        customer_subscriptions = stripe.Subscription.list(customer=customer.id)
        for subscription in customer_subscriptions.auto_paging_iter():
            if subscription.status == "active":
                customer_details = {
                    "email": customer.email,
                    "amount_paid": subscription.plan.amount,
                    "invoice_url": f"https://dashboard.stripe.com/test/invoices/{subscription.latest_invoice}",
                    # "invoice_url": f"https://dashboard.stripe.com/invoices/{subscription.latest_invoice}", # for real invoices
                    # Add other details you want
                }
                details.append(customer_details)

    return JsonResponse({'subscribed_users_details': details})

from subscriptions.models import CountSubscribedUser

@api_view(['GET'])
def count_of_subscribe_user_active(request):
    # breakpoint()
    ins = Subscription.objects.filter(status="active").count()
    # ins = CountSubscribedUser.objects.filter(id=1).values("total_user")
    resp_data=[{'total_user': ins}]
    return Response(ins,200)

@api_view(['GET'])
def count_of_subscribe_user_trail(request):
    ins = Subscription.objects.filter(status="trial").count()
    resp_data=[{'total_user': ins}]
    return Response(ins,200)
    
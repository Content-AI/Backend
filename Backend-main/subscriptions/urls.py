# api/urls.py
from django.urls import path
from .views import count_of_subscribe_user_trail, count_of_subscribe_user_active, subscribed_users_details, get_trail_total_subscribers, get_total_subscribers, times_remaining, create_invoice_portal_session, get_invoices_for_customer, cancel_subscription, direct_create_account_stripe_app_create_session, subcription_details, charge, subscribe_check, stripe_webhook, first_create_account_stripe_app_create_session, direct_create_team_seat_stripe_app_create_session

urlpatterns = [
    path('first-create-account-stripe-app-create-session/',
         first_create_account_stripe_app_create_session, name='create_checkout_session'),
    path('direct-create-account-stripe-app-create-session/', direct_create_account_stripe_app_create_session,
         name='direct_create_account_stripe_app_create_session'),
    path('direct-create-team-seat-stripe-app-create-session/', direct_create_team_seat_stripe_app_create_session,
         name='direct_create_team_seat_stripe_app_create_session'),
    # path('create-checkout-session/', create_checkout_session, name='create_checkout_session'),
    path('stripe-webhook/', stripe_webhook, name='stripe_webhook'),

    path('subscribe-check/', subscribe_check, name='subscribe_check'),

    path('charge/', charge, name='charge'),

    path('subcription-details/', subcription_details, name='subcription-details'),
    
    path('cancel-subscription-data-feedback/',
         cancel_subscription, name='cancel_subscription'),
    path('cancel-subscription-final/',
         cancel_subscription, name='cancel_subscription'),
    path('invoices/', get_invoices_for_customer,
         name='get_invoices_for_customer'),
    path('invoices-portal/', create_invoice_portal_session,
         name='create_invoice_portal_session'),
    path('times-remaining/', times_remaining, name='times_remaining'),
    path('get_total_subscribers/', get_total_subscribers,
         name='get_total_subscribers'),
    path('get_trail_total_subscribers/', get_trail_total_subscribers,
         name='get_trail_total_subscribers'),
    path('subscribed_users_details/', subscribed_users_details,
         name='subscribed_users_details'),

    path('count_of_subscribe_user_active/', count_of_subscribe_user_active,
         name='count_of_subscribe_user_active'),

    path('count_of_subscribe_user_trail/', count_of_subscribe_user_trail,
         name='count_of_subscribe_user_trail'),
    # path('count_of_subscribe_user_active/', count_of_subscribe_user_active, name='count_of_subscribe_user_active'),
]

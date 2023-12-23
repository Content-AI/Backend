from django.contrib import admin

from .models import EnterprisePlanList,MonthlyPlanList,YearlyPlanList,TeamMemberPrice,Subscription,SubscriptionMoney,SubscribedUser,CountSubscribedUser


class SubscriptionAdmin(admin.ModelAdmin):
    # list_display = ["user_id","restrict_user","customer_stripe_id","subscription_stripe_id","email","subscription_type","plan","status","trail_ends","started_at","end_at"]
    list_display = ["user_id","restrict_user","email","subscription_type","plan","status","trail_ends","started_at","end_at"]
    list_filter = ["user_id","restrict_user","email","subscription_type","plan","status","trail_ends","started_at","end_at"]
    search_fields = ["user_id__email","restrict_user","email","subscription_type","plan","status","trail_ends","started_at","end_at"]
    # ordering = ['created_at']
    list_per_page = 20

admin.site.register(Subscription,SubscriptionAdmin)
# admin.site.register(SubscribedUser)
# admin.site.register(TeamMemberPrice)
admin.site.register(SubscriptionMoney)
# admin.site.register(CountSubscribedUser)


class EnterprisePlanListAdmin(admin.ModelAdmin):
    list_display = ['point']
    list_display = ['point']
    list_filter = ['point']
    search_fields = ['point']
    ordering = ['created_at']
    list_per_page = 20
class MonthlyPlanListAdmin(admin.ModelAdmin):
    list_display = ['point']
    list_display =['point']
    list_filter = ['point']
    search_fields = ['point']
    ordering = ['created_at']
    list_per_page = 20
class YearlyPlanListAdmin(admin.ModelAdmin):
    list_display = ['point']
    list_display = ['point']
    list_filter = ['point']
    search_fields = ['point']
    ordering = ['created_at']
    list_per_page = 20

admin.site.register(EnterprisePlanList,EnterprisePlanListAdmin)
admin.site.register(MonthlyPlanList,MonthlyPlanListAdmin)
admin.site.register(YearlyPlanList,YearlyPlanListAdmin)



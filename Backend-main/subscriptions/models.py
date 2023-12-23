# subscriptions/models.py
from django.db import models
from accounts.models import UserAccount
class Subscription(models.Model):
    user_id = models.ForeignKey(UserAccount,unique=True,on_delete=models.CASCADE, related_name="user_stripe_pay")
    restrict_user = models.BooleanField(default=True,null=True,blank=True)
    customer_stripe_id = models.CharField(max_length=100, blank=True, null=True)
    subscription_stripe_id = models.CharField(max_length=100, blank=True, null=True)
    subscription_team_stripe_id = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(max_length=40)
    subscription_type = models.CharField(max_length=20, choices=[('monthly', 'monthly'), ('annually', 'annually')],null=True,blank=True)
    plan = models.CharField(max_length=20, choices=[('starter', 'starter'), ('premium', 'premium'), ('enterprise', 'enterprise')],null=True,blank=True)
    status = models.CharField(max_length=20, choices=[('trial', 'trial'), ('active', 'active'), ('canceled', 'canceled')], default='trial',null=True,blank=True)
    # started_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    trail_ends=models.DateTimeField(null=True,blank=True)
    started_at = models.DateTimeField(null=True,blank=True)
    end_at = models.DateTimeField(null=True,blank=True)

    def __str__(self):
        return str(self.user_id.email)


    class Meta:
        verbose_name_plural = "Subscription of Users"

class SubscriptionMoney(models.Model):
    monthly_starter = models.CharField(max_length=40)
    monthly_premium_mode = models.CharField(max_length=40)
    annaully_starter = models.CharField(max_length=40)
    annaully_premium_mode = models.CharField(max_length=40)

    def __str__(self):
        return "Charge for User"


    class Meta:
        verbose_name_plural = "Subscription Payment"

class TeamMemberPrice(models.Model):
    price_per_seat = models.CharField(max_length=40)
    def __str__(self):
        return "Price per Seat"
    class Meta:
        verbose_name_plural = "Price of Seat"



class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class EnterprisePlanList(TimestampedModel):
    point = models.CharField(max_length=400,null=True,blank=True)
    def __str__(self):
        return str(self.point)
    class Meta:
        verbose_name_plural = "Why Enterprise"

class MonthlyPlanList(TimestampedModel):
    point = models.CharField(max_length=400,null=True,blank=True)
    def __str__(self):
        return str(self.point)
    class Meta:
        verbose_name_plural = "Why Monthly"

class YearlyPlanList(TimestampedModel):
    point = models.CharField(max_length=400,null=True,blank=True)
    def __str__(self):
        return str(self.point)
    class Meta:
        verbose_name_plural = "Why Yearly"



class SubscribedUser(models.Model):
    email = models.EmailField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    invoice_url = models.URLField()

    def __str__(self):
        return self.email
class CountSubscribedUser(models.Model):
    total_user = models.CharField(max_length=100)

    def __str__(self):
        return self.total_user
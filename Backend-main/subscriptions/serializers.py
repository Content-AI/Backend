from rest_framework import serializers
from subscriptions.models import Subscription
from template.times_convert import format_time_elapsed,updated_time_format

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"




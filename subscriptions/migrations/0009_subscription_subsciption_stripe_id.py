# Generated by Django 4.2.2 on 2023-08-01 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0008_rename_annaully_boss_mode_subscriptionmoney_annaully_premium_mode_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='subsciption_stripe_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]

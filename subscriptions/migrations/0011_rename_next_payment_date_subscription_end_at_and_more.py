# Generated by Django 4.2.2 on 2023-08-09 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0010_rename_subsciption_stripe_id_subscription_subscription_stripe_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subscription',
            old_name='next_payment_date',
            new_name='end_at',
        ),
        migrations.AlterField(
            model_name='subscription',
            name='started_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

# Generated by Django 3.2 on 2023-08-14 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0011_rename_next_payment_date_subscription_end_at_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubscribedUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('amount_paid', models.DecimalField(decimal_places=2, max_digits=10)),
                ('invoice_url', models.URLField()),
            ],
        ),
    ]

# Generated by Django 4.2.2 on 2023-07-28 07:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_alter_generalsetting_billing_email_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='generalsetting',
            name='billing_email',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]

# Generated by Django 4.2.2 on 2023-06-20 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='auth_provider',
            field=models.CharField(default='email', max_length=255),
        ),
    ]

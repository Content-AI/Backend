# Generated by Django 3.2 on 2023-08-26 19:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0026_auto_20230820_0556'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='visitor',
            name='count',
        ),
    ]

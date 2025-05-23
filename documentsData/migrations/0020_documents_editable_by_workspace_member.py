# Generated by Django 4.2.2 on 2023-08-06 04:38

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('documentsData', '0019_documents_visible_by_workspace_member'),
    ]

    operations = [
        migrations.AddField(
            model_name='documents',
            name='editable_by_workspace_member',
            field=models.ManyToManyField(blank=True, null=True, related_name='editable_workspaces', to=settings.AUTH_USER_MODEL),
        ),
    ]

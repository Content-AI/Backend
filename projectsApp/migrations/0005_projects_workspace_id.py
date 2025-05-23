# Generated by Django 4.2.2 on 2023-08-04 18:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('team_members', '0013_alter_initialworkshopofuser_user_filter'),
        ('projectsApp', '0004_alter_projects_favorite_alter_projects_trash'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='workspace_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='workspace_id_of_user_project', to='team_members.workspace'),
        ),
    ]

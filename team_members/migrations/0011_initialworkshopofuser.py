# Generated by Django 4.2.2 on 2023-08-04 15:05

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('team_members', '0010_teammemberlist_second_layer_admin_or_not'),
    ]

    operations = [
        migrations.CreateModel(
            name='InitialWorkShopOfUser',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('workspace_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workspace_id_of_user', to='team_members.workspace')),
            ],
        ),
    ]

# Generated by Django 4.2.2 on 2023-07-16 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projectsApp', '0003_rename_publish_projects_trash'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projects',
            name='favorite',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AlterField(
            model_name='projects',
            name='trash',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]

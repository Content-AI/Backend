# Generated by Django 4.2.2 on 2023-07-16 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documentsData', '0009_alter_documents_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projects',
            name='project_name',
            field=models.TextField(blank=True, max_length=30, null=True),
        ),
    ]

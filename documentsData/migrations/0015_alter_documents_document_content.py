# Generated by Django 4.2.2 on 2023-07-26 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documentsData', '0014_alter_documents_document_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documents',
            name='document_content',
            field=models.JSONField(blank=True, default={}, null=True),
        ),
    ]

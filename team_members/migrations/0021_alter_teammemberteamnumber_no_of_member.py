# Generated by Django 3.2 on 2023-10-02 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('team_members', '0020_alter_teammemberteamnumber_no_of_member'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teammemberteamnumber',
            name='no_of_member',
            field=models.CharField(blank=True, default=1, max_length=40, null=True),
        ),
    ]

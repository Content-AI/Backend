# Generated by Django 3.2 on 2023-08-28 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('template', '0045_delete_openaitoken'),
    ]

    operations = [
        migrations.CreateModel(
            name='OpenAiToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token_generated', models.CharField(max_length=400)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Open AI Token',
            },
        ),
        migrations.AlterModelOptions(
            name='singleusertokengenerated',
            options={'verbose_name_plural': 'Token Per user'},
        ),
    ]

# Generated by Django 4.1.5 on 2023-04-29 11:21

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_userinfo_description_alter_userfriend_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='track',
            name='date_posted',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
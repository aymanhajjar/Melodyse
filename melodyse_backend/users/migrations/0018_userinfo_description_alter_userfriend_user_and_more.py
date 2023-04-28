# Generated by Django 4.1.5 on 2023-04-28 23:42

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_userskill'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='userfriend',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friends', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='favorite_artists',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, default=[], null=True, size=None),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='favorite_songs',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, default=[], null=True, size=None),
        ),
    ]

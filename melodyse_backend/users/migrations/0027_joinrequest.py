# Generated by Django 4.1.5 on 2023-05-07 21:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0026_rename_google_access_token_user_google_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='JoinRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True)),
                ('is_accepted', models.BooleanField(blank=True, null=True)),
                ('is_seen', models.BooleanField(default=False)),
                ('initiator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requests_sent', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requests', to='users.project')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='join_requests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

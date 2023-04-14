# Generated by Django 4.1.5 on 2023-04-14 22:09

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('is_admin', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats_admin', to=settings.AUTH_USER_MODEL)),
                ('participants', models.ManyToManyField(related_name='chats', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('date_started', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField(blank=True)),
                ('is_collab', models.BooleanField()),
                ('is_completed', models.BooleanField(default=False)),
                ('members', models.ManyToManyField(related_name='projects_active', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SubscriptionPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.IntegerField(unique=True)),
                ('name', models.CharField(max_length=200)),
                ('card_color', models.CharField(max_length=200)),
                ('is_popular', models.BooleanField()),
                ('number_of_users', models.BigIntegerField()),
                ('price_per_month', models.IntegerField()),
                ('max_personal_projects', models.IntegerField()),
                ('points', models.IntegerField()),
                ('tag_on_profile', models.CharField(max_length=100)),
                ('profile_color', models.CharField(blank=True, max_length=200)),
                ('features', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), size=None)),
            ],
        ),
        migrations.CreateModel(
            name='Track',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('track', models.FileField(upload_to='user_tracks/')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('number_of_plays', models.BigIntegerField(default=0)),
                ('is_personal', models.BooleanField()),
                ('likes', models.ManyToManyField(related_name='likes', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tracks', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='final_track', to='melodyse.project')),
            ],
        ),
        migrations.CreateModel(
            name='UserRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField()),
                ('target_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ratings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_of_birth', models.DateField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('favorite_artists', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, size=None)),
                ('favorite_songs', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, size=None)),
                ('picture', models.ImageField(upload_to='profile_pictures/')),
                ('rating', models.DecimalField(decimal_places=1, default=0, max_digits=2)),
                ('subscription_started', models.DateTimeField(auto_now_add=True)),
                ('points_used', models.IntegerField(default=0)),
                ('subscription', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='users_subscribed', to='melodyse.subscriptionplan', to_field='level')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='info', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserFriend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_accepted', models.DateTimeField(auto_now_add=True)),
                ('friend', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_of', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TrackComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments_sent', to=settings.AUTH_USER_MODEL)),
                ('track', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='melodyse.track')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('order', models.IntegerField(default=0)),
                ('is_completed', models.BooleanField(default=False)),
                ('is_milestone', models.BooleanField(default=False)),
                ('payout', models.IntegerField(blank=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='melodyse.project')),
                ('target_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_tasks', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ProjectInvite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_collab', models.BooleanField()),
                ('offered_amount', models.IntegerField(blank=True)),
                ('is_accepted', models.BooleanField(default=False)),
                ('initiator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invites_sent', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invites', to='melodyse.project')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_invites', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='melodyse.project')),
                ('target_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('is_read', models.BooleanField(default=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages_sent', to=settings.AUTH_USER_MODEL)),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='melodyse.chat')),
            ],
        ),
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_accepted', models.BooleanField(default=False)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_requests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='project_files/')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uploaded_files', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to='melodyse.project')),
            ],
        ),
        migrations.AddField(
            model_name='chat',
            name='project',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='chat', to='melodyse.project'),
        ),
    ]

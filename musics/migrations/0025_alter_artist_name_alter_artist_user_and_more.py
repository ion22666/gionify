# Generated by Django 4.1.3 on 2022-12-15 11:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('musics', '0024_alter_artist_name_alter_userprofile_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artist',
            name='name',
            field=models.CharField(default='Artist #88408', max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='artist',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, unique=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='name',
            field=models.CharField(default='User #91147', max_length=400, null=True),
        ),
    ]

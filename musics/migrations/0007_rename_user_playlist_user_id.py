# Generated by Django 4.1.1 on 2022-10-23 17:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('musics', '0006_rename_user_id_playlist_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='playlist',
            old_name='user',
            new_name='user_id',
        ),
    ]

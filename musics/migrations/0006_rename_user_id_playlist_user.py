# Generated by Django 4.1.1 on 2022-10-23 17:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('musics', '0005_alter_music_cover_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='playlist',
            old_name='user_id',
            new_name='user',
        ),
    ]

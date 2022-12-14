# Generated by Django 4.1.3 on 2022-12-08 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musics', '0016_rename_playlist_id_likedplaylists_playlist_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='playlist',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='playlist_group',
            old_name='playlist_id',
            new_name='playlist',
        ),
        migrations.RenameField(
            model_name='playlist_group',
            old_name='song_id',
            new_name='song',
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='name',
            field=models.CharField(default='User #51510', max_length=400),
        ),
    ]

# Generated by Django 4.1.1 on 2022-10-22 07:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musics', '0003_rename_playlists_playlist_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='music',
            name='cover_image',
            field=models.FileField(upload_to='music_images/'),
        ),
    ]

# Generated by Django 4.1.3 on 2022-12-15 06:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import musics.validators


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('musics', '0018_alter_userprofile_name_alter_userprofile_picture'),
    ]

    operations = [
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Artist #59886', max_length=400, null=True)),
                ('picture', models.FileField(default='artist_img/blank_profile.png', null=True, upload_to='music_images/', validators=[musics.validators.validate_is_img])),
                ('background_picture', models.FileField(default='profile_img/blank_profile.png', null=True, upload_to='music_images/', validators=[musics.validators.validate_is_img])),
                ('image_colors', models.CharField(default='["0,0,0","0,0,0","0,0,0"]', max_length=500)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='name',
            field=models.CharField(default='User #89257', max_length=400, null=True),
        ),
        migrations.CreateModel(
            name='SongArtistGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('artist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='musics.artist')),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='musics.music')),
            ],
        ),
        migrations.CreateModel(
            name='AlbumSongGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='musics.album')),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='musics.music')),
            ],
        ),
        migrations.CreateModel(
            name='AlbumArtistGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='musics.album')),
                ('artist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='musics.artist')),
            ],
        ),
    ]

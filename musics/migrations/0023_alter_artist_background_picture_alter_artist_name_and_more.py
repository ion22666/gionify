# Generated by Django 4.1.3 on 2022-12-15 09:34

from django.db import migrations, models
import musics.validators


class Migration(migrations.Migration):

    dependencies = [
        ('musics', '0022_alter_artist_name_alter_userprofile_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artist',
            name='background_picture',
            field=models.FileField(default='artist_img/default_background.jpg', null=True, upload_to='music_images/', validators=[musics.validators.validate_is_img]),
        ),
        migrations.AlterField(
            model_name='artist',
            name='name',
            field=models.CharField(default='Artist #59513', max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='artist',
            name='picture',
            field=models.FileField(default='artist_img/default_artist.png', null=True, upload_to='music_images/', validators=[musics.validators.validate_is_img]),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='name',
            field=models.CharField(default='User #70503', max_length=400, null=True),
        ),
    ]

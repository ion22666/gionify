# Generated by Django 4.1.3 on 2022-11-15 13:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musics', '0002_music_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='music',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2022, 11, 15, 15, 14, 3, 899363)),
            preserve_default=False,
        ),
    ]

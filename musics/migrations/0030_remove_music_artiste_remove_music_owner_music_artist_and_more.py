# Generated by Django 4.1.3 on 2022-12-17 14:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('musics', '0029_alter_artist_name_alter_userprofile_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='music',
            name='artiste',
        ),
        migrations.RemoveField(
            model_name='music',
            name='owner',
        ),
        migrations.AddField(
            model_name='music',
            name='artist',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='songs', to='musics.artist'),
        ),
        migrations.AlterField(
            model_name='artist',
            name='name',
            field=models.CharField(default='Artist #76741', max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='name',
            field=models.CharField(default='User #89256', max_length=400, null=True),
        ),
    ]

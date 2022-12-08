from math import floor
from django.shortcuts import get_object_or_404
from musics.helper import get_audio_length
from django.db import models
from musics.validators import validate_is_audio, validate_is_img
from django.conf import settings
from django.apps import AppConfig
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from colorthief import ColorThief
from django.core.files.storage import FileSystemStorage
import random


class Music(models.Model):
    default_auto_field = 'django.db.models.AutoField'
    title=models.CharField(max_length=500)
    artiste=models.CharField(max_length=500)
    album=models.ForeignKey('Album',on_delete=models.SET_NULL,null=True,blank=True)
    time_length=models.CharField(max_length=20,blank=True)
    audio_file=models.FileField(upload_to='musics/',validators=[validate_is_audio])
    cover_image=models.FileField(upload_to='music_images/',validators=[validate_is_img])
    image_colors = models.CharField(max_length=500,default='["0,0,0","0,0,0","0,0,0"]')
    owner = models.ForeignKey(User, related_name='songs', on_delete=models.CASCADE,null=True,blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    
    def save(self,*args, **kwargs):
        if self.album:
            self.album=Album.objects.get_or_create(name=self.album)[0]
        l = get_audio_length(self.audio_file)
        self.time_length = str(int(l//60)).zfill(1) + ':' + str(floor(l%60)).zfill(2)
        self.image_colors = list(map(lambda x:",".join(list(map(lambda x:str(x),x))),ColorThief(self.cover_image).get_palette(color_count=2)))
        return super().save(*args, **kwargs)

    '''    def __str__(self):
            d = {
                'title':self.title,
                'artiste':self.artiste,
                'album':self.album,
                'audio_file':self.audio_file,
                'cover_image':self.cover_image
            }
            return '''
    def __str__(self):
        return self.title
    class META:
        ordering="id"



class Album(models.Model):
    default_auto_field = 'django.db.models.AutoField'
    name = models.CharField(max_length=400)

    def __str__(self):
        return self.name


def random_img():
    return 'playlist_img/default-playlist-img'+str(random.randint(1, 5))+'.png'
    
class Playlist(models.Model):
    default_auto_field = 'django.db.models.AutoField'
    name = models.CharField(max_length=400)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,null=False,blank=False)

    cover_image=models.FileField(storage=FileSystemStorage(location=settings.MEDIA_ROOT),upload_to='music_images/',validators=[validate_is_img],default=random_img)
    image_colors = models.CharField(max_length=500,default='["0,0,0","0,0,0","0,0,0"]')
    def save(self,*args, **kwargs):
        self.image_colors = list(map(lambda x:",".join(list(map(lambda x:str(x),x))),ColorThief(self.cover_image).get_palette(color_count=2)))
        return super().save(*args, **kwargs)
    def __str__(self):
        return self.name

class Playlist_group(models.Model):
    default_auto_field = 'django.db.models.AutoField'
    playlist = models.ForeignKey('Playlist',on_delete=models.CASCADE,null=False,blank=False)
    song = models.ForeignKey('Music',on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
        return str(self.playlist_id) + " " + str(self.song_id)

class LikedPlaylists(models.Model):
    default_auto_field = 'django.db.models.AutoField'
    playlist = models.ForeignKey('Playlist',on_delete=models.CASCADE,null=False,blank=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,null=False,blank=False)

class UserProfile(models.Model):
    default_auto_field = 'django.db.models.AutoField'
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,null=False,blank=False)
    picture = models.FileField(upload_to='music_images/',validators=[validate_is_img])
    name = models.CharField(max_length=400,default="User #"+str(random.randint(10000, 99999)))

    def __str__(self):
        return self.name
    
def create_profile(sender,instance,created,**kwargs):
    if created:
        UserProfile.objects.create(user=instance)
post_save.connect(create_profile,sender=User)

from django.contrib import admin
from .models import Music, Album, Playlist, Playlist_group

admin.site.register(Music)
admin.site.register(Album)
admin.site.register(Playlist)
admin.site.register(Playlist_group)
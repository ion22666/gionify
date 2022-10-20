from django.contrib import admin
from .models import Music, Album, Playlist

admin.site.register(Music)
admin.site.register(Album)
admin.site.register(Playlist)
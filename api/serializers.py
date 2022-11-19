from rest_framework import serializers
from musics.models import Music
from colorthief import ColorThief

class MusicSer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username',default = None)
    class Meta:
        model = Music
        fields = [
            'id',
            'title',
            'artiste',
            'album',
            'time_length',
            'audio_file',
            'cover_image',
            'image_colors',
            'date_created',
            'owner'
        ]
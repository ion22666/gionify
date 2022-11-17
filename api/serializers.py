from rest_framework import serializers
from musics.models import Music
from colorthief import ColorThief

class MusicSer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username',default = None)
    dominant_colors = serializers.SerializerMethodField('get_colors')
    def get_colors(self, obj):
        return ColorThief(obj.cover_image).get_palette(color_count=2)
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
            'dominant_colors',
            'date_created',
            'owner'
        ]
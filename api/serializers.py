from rest_framework import serializers
from musics.models import Music

class MusicSer(serializers.ModelSerializer):
    class Meta:
        model = Music
        fields = '__all__'
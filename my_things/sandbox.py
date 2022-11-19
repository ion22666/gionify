from colorthief import ColorThief
from musics.models import Music
from django.conf import settings
print(settings.BASE_DIR)
for i in range(100):
    try:
        print(ColorThief(Music.objects.get(pk=i).cover_image).get_palette(color_count=2))
    except:
        pass
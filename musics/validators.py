import os

from django.core.exceptions import ValidationError
from mutagen.mp3 import MPEGInfo
from PIL.Image import open

def validate_is_img(file):
    try:
        img = open(file,formats=['PNG','JPEG','GIF','WEBP'])
    except Exception as e:
        raise ValidationError('Unsupported file. Supported(PNG,JPEG,GIF,WEBP)')

def validate_is_audio(file):
    try:
        audio = MPEGInfo(file)
        if not audio :
            raise TypeError()

        first_file_check=True
        
    except Exception as e:
        first_file_check=False
    
    if not first_file_check:
        raise ValidationError('Unsupported file type.')
    valid_file_extensions = ['.mp3']
    ext = os.path.splitext(file.name)[1]
    if ext.lower() not in valid_file_extensions:
        raise ValidationError('Unacceptable file extension.')
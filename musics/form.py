from dataclasses import fields
from django.forms import widgets
from musics.models import Music, Playlist, Playlist_group, UserProfile, Artist
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class AddMusicForm(forms.ModelForm):
    album=forms.CharField(max_length=500,required=False)

    
    class Meta:
        model=Music
        fields=[
            'title',
            'artist',
           
            'audio_file',
            'cover_image',
        ]

class AddPlaylistForm(forms.ModelForm):
    class Meta:
        model=Playlist
        fields=[
            'name',
            'cover_image',
        ]

class ProfileForm(forms.ModelForm):
    class Meta:
        model=UserProfile
        fields=[
            'name',
            'picture',
        ]

class ArtistForm(forms.ModelForm):
    class Meta:
        model=Artist
        fields=[
            'name',
            'picture',
            'background_picture',
        ]

class ManageMusicForm(forms.ModelForm):
    album=forms.CharField(max_length=500,required=False)

    
    class Meta:
        model=Music
        fields=[
            'title',
            'artist',
           
            'audio_file',
            'cover_image',
        ]

class CreateUserForm(UserCreationForm):

    password1 = forms.CharField(label='Confirm password', widget=forms.PasswordInput,help_text='length at least 8 and not allowed only digits')  
         
    class Meta:
        model = User
        fields = ['username','password1','password2','first_name','last_name']


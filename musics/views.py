import json
from django.http import HttpResponse, HttpRequest
from musics.models import Album, Music, Playlist, Playlist_group
from django.shortcuts import redirect, render, get_object_or_404
from .form import AddMusicForm, ManageMusicForm, CreateUserForm, AddPlaylistForm
from django.contrib import messages  
from django.contrib.auth import authenticate, login, logout
from .decorators import logged_not_allowed, allowed_goups, admin_only, only_logged
from django.core.signals import request_finished
from django.dispatch import receiver
from django.views.generic.base import RedirectView
from django.conf import settings
from . import urls


@only_logged("You must be logged in to access the home page")
@allowed_goups(['full_admin','db_staff'])
def homePage(request):
    musics_list = list(Music.objects.select_related('album').all().values())
    playlist_list = list(Playlist.objects.select_related('user_id').filter(user_id=request.user.id).values())
    url_patterns = { i.name : str(i.pattern)[0:str(i.pattern).find('/')+1] for i in urls.urlpatterns}

    for playlist in playlist_list:
        playlist['songs_count'] = Playlist_group.objects.filter(playlist_id=playlist['id']).count()
    for music in musics_list:
        if music["album_id"]!=None:
            music["album_name"]=Album.objects.get(id=music["album_id"]).name
        else:
            music["album_name"]='Single'
    return render(request,'home.html',{
        'musics_list':musics_list,
        'playlist_list':playlist_list,
        'url_patterns':url_patterns,
    })

@only_logged("Only those logged in can logout")
def logout_user(request):
    if request.POST:
        if request.POST.get('DA'):
            logout(request)
            return redirect('musics:login_user')
        if request.POST.get('NU'):
            return redirect('musics:home_page')
    return render(request,'form_pages_content/logout_user.html')


@logged_not_allowed("You're already logged in, you want to logout?")
def login_user(request):
    if request.POST:
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request,username=username,password=password)

        if user is not None:
            login(request,user)
            return redirect('musics:home_page')
        else:
            messages.info(request,'Ceva nu e bine')
    return render(request,'form_pages_content/login_user.html')

@logged_not_allowed("You're already registered and logged in, you want to logout?")
def register_user(request):

    form = CreateUserForm()
    if request.POST:
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save() 
            user_name = form.cleaned_data.get('username')
            messages.success(request,'Sa creat bine',user_name)
            return redirect("music:login_user")

    return render(request,'form_pages_content/register_user.html',{'form':form,})

def addSong(request):
    form=AddMusicForm()
    if request.POST:
        form=AddMusicForm(request.POST,request.FILES)
        if form.is_valid():
            instance=form.save(commit=False)
            album=form.cleaned_data.get('album')

            if album:
                music_album=Album.objects.get_or_create(name=album)
                print(music_album)
                instance.album=music_album[0]
                instance.save()
            else:
                print("sa salvat")
                instance.save()
            return HttpResponse(json.dumps({'message': "done"}))
        else:
            print("no",form.data)
            print(form.errors.as_data())

    if 'HTTP_REFERER' in request.META.keys() and request.META['HTTP_REFERER']=='http://127.0.0.1:8000/':
        return render(request,'form_pages_content/add_song_form.html',{
            'form':form,
    })
    return redirect("music:home_page")

def delete_song(request,song_id):
    song=get_object_or_404(Music, pk=song_id)
    
    if request.POST:
        song.delete() 
        return redirect("music:home_page")
    return render(request,'form_pages_content/delete_song.html',{'song':song})

def manage_song(request,song_id):
    song=get_object_or_404(Music, pk=song_id)
    form=ManageMusicForm(instance=song)

    if request.POST:
        form=ManageMusicForm(request.POST,request.FILES,instance=song)
        if form.is_valid():
            song=form.save(commit=False)
            album=form.cleaned_data.get('album')
            if album:
                music_album=Album.objects.get_or_create(name=album)
                song.album=music_album[0]
                song.save()
                return redirect("music:home_page")
            else:
                song.save()
                return redirect("music:home_page")
        else:
            print("no",form.data)
            print(form.errors.as_data())


    return render(request,'form_pages_content/manage_song.html',{
        'form':form,
        'song':song,
    })
def add_playlist_view(request):
    form=AddPlaylistForm()
    if request.POST:
        form=AddPlaylistForm(request.POST)
        print(form.data)
        if form.is_valid():
            instance=form.save(commit=False)
            if request.user.is_authenticated:
                user = request.user
            else:
                return HttpResponse("ce dreacu faci bre?")
            instance.user_id = user
            instance.save()
            print("sa salvat")
            return HttpResponse(json.dumps({'message': "sa creat un playlist"}))
        else:
            print("no",form.data)
            print(form.errors.as_data())

    if 'HTTP_REFERER' in request.META.keys() and request.META['HTTP_REFERER']=='http://127.0.0.1:8000/':
        return render(request,'form_pages_content/create_playlist_form.html',{
            'form':form,
    })
    return redirect("music:home_page")
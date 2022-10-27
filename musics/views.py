import json
from re import template
from urllib import response

from django.template import Template, Context, loader
from django.http import HttpResponse, HttpRequest
from numpy import true_divide
from musics.models import Album, Music, Playlist, Playlist_group, LikedPlaylists, UserProfile
from django.shortcuts import redirect, render, get_object_or_404
from django.dispatch import receiver
from django.views.generic.base import RedirectView
from django.middleware.csrf import CsrfViewMiddleware
from django.core.exceptions import ObjectDoesNotExist
from django.core.signals import request_finished
from django.contrib import messages  
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.contrib.auth.models import User
from . import urls
from .decorators import logged_not_allowed, allowed_goups, admin_only, only_logged
from .form import AddMusicForm, ManageMusicForm, CreateUserForm, AddPlaylistForm



@only_logged("You must be logged in to access the home page")
@allowed_goups(['full_admin','db_staff'])
def main_view(request):
    home_pre_render,musics_list = home_page_view(request,direct=False)
    main_menu_render = main_menu_view(request,direct=False)
    url_patterns = { i.name : str(i.pattern)[0:str(i.pattern).find('/')+1] for i in urls.urlpatterns}
    playlist_list = list(Playlist.objects.select_related('user_id').filter(user_id=request.user.id).values())
    for playlist in playlist_list:
            playlist['songs_count'] = Playlist_group.objects.filter(playlist_id=playlist['id']).count()
            playlist['songs_id'] = list(Playlist_group.objects.filter(playlist_id=playlist['id']).values_list('song_id',flat=True))
    return render(request,'home.html',{
        'musics_list':musics_list,
        'home_pre_render':home_pre_render,
        'main_menu_pre_render':main_menu_render,
        'playlist_list':get_playlist_list(request),
        'main_playlist_id':get_main_playlist_id(request),
        'url_patterns':url_patterns,
        'current_user':request.user.username,
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

def profile_page_view(request,user_name):
    if str(request.user)!=user_name:
        return redirect('musics:home_page')
    profile = UserProfile.objects.get(user_id=request.user.id)
    #aparent cand un field este de foreigkey, acel fild va tine o valoare de tip obiect, deci vom pute scrie profile.user_id.id
    print(profile.user.id)
    template = loader.get_template('main_page/profile_page.html')
    response = template.render({'username':str(request.user),'picture':profile.picture})
    return HttpResponse(content=response)


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
            return render(
                request,
                template_name='form_pages_content/add_song_form.html',
                context={'form':form,},
                status=415,
            )

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


def user_request_view(request):
    
    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        song = Music.objects.get(pk=data['song_id'])
        playlist =Playlist.objects.get(pk=data['playlist_id'])
        if data['add']:
            try:
                if Playlist_group.objects.get(song_id=song,playlist_id=playlist):
                    print('alredy exist')
                    return HttpResponse(status=400,content=json.dumps({'message': "alredy exist"}))
            except:
                instance = Playlist_group.objects.create(song_id=song,playlist_id=playlist)
                instance.save()
                print('sa salvat')
                return HttpResponse(status=201,content=json.dumps({'message': "sa salvat",'get_playlist_list':(get_playlist_list(request))}))
            
        else:
            print('sa sters')
            Playlist_group.objects.filter(song_id=song,playlist_id=playlist).delete()
            return HttpResponse(status=202,content=json.dumps({'message': "sa eliminat",'get_playlist_list':(get_playlist_list(request))}))
    else:
        return HttpResponse(status=405)


def liked_songs_view(request):
    if request.user.is_authenticated:
        try:#verificam daca in tabela LikedPlaylists exista vreun rand care sa contina id-ul userului
            liked_playlist = LikedPlaylists.objects.get(user_id=request.user)
        except LikedPlaylists.DoesNotExist: # daca nu exista , cream un plailist nou si il folosim drept pentru liked_song playlist
            get_main_playlist_id()
        liked_ids = list(Playlist_group.objects.filter(playlist_id=liked_playlist.playlist_id).values_list('song_id',flat=True))
        liked_songs = (list(Music.objects.filter(pk__in=liked_ids).values()))
        template = loader.get_template('main_page/liked_songs_page.html')
        response = template.render({'songs':liked_songs,'playlist_id':liked_playlist.playlist_id})
        return HttpResponse(content=response)
    else:
        HttpResponse(staus=401)
        

def home_page_view(request,direct=True):
    home_songs = list(Music.objects.select_related('album').all().values())
    for music in home_songs:
        if music["album_id"]!=None:
            music["album_name"]=Album.objects.get(id=music["album_id"]).name
        else:
            music["album_name"]='Single'
    template = loader.get_template('main_page/home_page.html')
    response = template.render({'home_songs':home_songs,'playlist_list':get_playlist_list(request),})
    if direct:
        return HttpResponse(content=response)
    return [response,home_songs]

def main_menu_view(request,direct=True):
    template = loader.get_template('main_menu_content.html')
    response = template.render({'playlist_list':get_playlist_list(request)})
    if direct:
        return HttpResponse(content=response)
    return response

def playlist_page_view(request,playlist_id):
    try:
        playlist = Playlist.objects.get(pk=playlist_id)
        songs = Music.objects.filter(pk__in=list(Playlist_group.objects.filter(playlist_id=playlist).values_list('song_id',flat=True)))
        template = loader.get_template('main_page/playlist_page.html')
        response = template.render({'playlist':playlist,'songs':songs})
        return HttpResponse(content=response)
    except Playlist.DoesNotExist:
        return redirect('musics:home_page')




########################################################################################
def get_playlist_list(request):
    playlist_list = { p['id']:p for p in list(Playlist.objects.select_related('user_id').filter(user_id=request.user.id).values())}
    for id in playlist_list.keys():
            playlist_list[id]['songs_count'] = Playlist_group.objects.filter(playlist_id=id).count()
            playlist_list[id]['songs_id'] = list(Playlist_group.objects.filter(playlist_id=id).values_list('song_id',flat=True))
    return playlist_list

def get_main_playlist_id(request):
    try:
        return list(LikedPlaylists.objects.filter(user_id=request.user).values_list('playlist_id',flat=True))[0]
    except:
        # new_playlist nu este la fel ca new_playlist.save() , isi pierde proprietetea de instanta a clasei dupa ce se salveaza
        #si nu mai poate fi folosit ca referinta pentru alte obiecte cu relatii 
        new_playlist = Playlist.objects.create(name='2266',user_id=request.user)
        liked_playlist = LikedPlaylists.objects.create(user_id=request.user,playlist_id=new_playlist)
        new_playlist.save()
        liked_playlist.save()
        return get_main_playlist_id(request)
import json
from math import floor
import os
from django.core import serializers
from django.template import Template, Context, loader
from django.http import HttpResponse, HttpRequest
from musics.models import Album, Music, Playlist, Playlist_group, LikedPlaylists, UserProfile, Artist
from django.shortcuts import redirect, render, get_object_or_404
from django.dispatch import receiver
from django.views.generic.base import RedirectView
from django.middleware.csrf import CsrfViewMiddleware
from django.core.exceptions import ObjectDoesNotExist
from django.core.signals import request_finished
from django.contrib import messages  
from django.contrib.auth import authenticate, login, logout as logout_user
from django.conf import settings
from django.contrib.auth.models import User
from . import urls
from django.urls import reverse
from .decorators import logged_not_allowed, allowed_goups, admin_only, only_logged, dirrect_not_allowed
from .form import AddMusicForm, ManageMusicForm, CreateUserForm, AddPlaylistForm, ProfileForm, ArtistForm
from django.templatetags.static import static
from colorthief import ColorThief
from django.views.decorators.csrf import requires_csrf_token
from django.http import JsonResponse
from django.middleware.csrf import get_token
from .serializers import FlatJsonSerializer



# acest view va fi apelat doar cand intram prima oara pe site
# in template verificam daca userul este logat , si il fortam sa faca request la login sau application
def main(request):
    print(request.user.is_authenticated)
    return render(request,'main.html')



## HOME PAGE
@only_logged("You must be logged in to access the home page")
#@allowed_goups(['full_admin','db_staff'])
def application(request):

    main_playlist = get_main_playlist(request)
    playlists = get_playlist_list(request)
    musics_list = get_all_songs()
    url_patterns = { i.name : str(i.pattern)[0:str(i.pattern).find('/')+1] for i in urls.urlpatterns}
    
    home_pre_render = home_page_view(request)
    main_menu_render = main_menu(request)

    response = render(
        request,
        'app.html',
        {
            "profile_id":UserProfile.objects.get(user=request.user).pk,
            'musics_list':musics_list,
            'home_pre_render':home_pre_render,
            'main_menu_pre_render':main_menu_render,
            'playlist_list':playlists,
            'main_playlist_id':main_playlist,
            'url_patterns':url_patterns,
            'current_user':request.user.username,
        }
    )
    return response


## LOGIN PAGE
# @logged_not_allowed("You're already logged in, you want to logout?")
# @dirrect_not_allowed
def login_page(request):
    if request.method == 'POST':
        print(request)
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request,username=username,password=password)
        print(user," sa loggat")
        if user is not None:
            login(request,user)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=403,content=json.dumps({'error':'user not exists'}))
    response = render(request,'login.html',
        {
            'url_patterns': { i.name : str(i.pattern)[0:str(i.pattern).find('/')+1] for i in urls.urlpatterns},
        }
    )
    return response


@only_logged("Only those logged in can logout")
def logout(request):
    #if request.method == 'POST':
    if request.user.is_authenticated:
        logout_user(request)
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400)


@logged_not_allowed("You're already registered and logged in, you want to logout?")
def register_user(request):
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("music:home_page")
    else:
        form = CreateUserForm()
    return JsonResponse({"message":"ceva na mers bine"})
    # if request.POST:
    #     form = CreateUserForm(request.POST)
    #     if form.is_valid():
    #         form.save() 
    #         user_name = form.cleaned_data.get('username')
    #         messages.success(request,'Sa creat bine',user_name)
    #         return redirect("music:login_user")

    # return render(request,'form_pages_content/register_user.html',{'form':form,})


@only_logged("Only those logged in can logout")
def profile(request,profile_id=None):
    if profile_id == None:
        return HttpResponse(content=loader.render_to_string("app/forms/profile_edit.html",{"profile":UserProfile.objects.get(user=request.user)},request))

    try:
        profile = UserProfile.objects.get(pk=profile_id)
    except UserProfile.DoesNotExist:
        return HttpResponse(status=404, content=json.dumps({'message': "Profile not found"}))
            # UserProfile.objects.create(user=request.user).save()
            # return profile(request)

    if request.method == "GET": # return my profile
        playlists = get_playlist_list(request)
        try:
            Artist.objects.get(user=request.user)
            is_artist = True
        except Artist.DoesNotExist:
            is_artist = False
        response = loader.render_to_string('app/views/profile.html',{'profile':profile,"playlists":playlists,"is_artist":is_artist},request)
        return HttpResponse(status=200,content=response)

    if request.method == "POST":
        # obiectele FormModel de asemenea se folosesc pentru a colecta datele din request, le verifica si le atribuie frumos in field-uri de care ne trebe noua
        
        # try:
        #     profile.picture = request.FILES["picture"]
        # except:
        #     pass
        # try:
        #     profile.name = request.POST["name"]
        # except:
        #     pass

        form = ProfileForm(request.POST or None, request.FILES or None, instance=profile)
        if form.is_valid():
            profile.save()
            return HttpResponse(status=201, content=json.dumps({'message': "Playlist Created"}))
        return HttpResponse(status=406, content=json.dumps({'message': "Invalid data"}))


@only_logged("")
def addSong(request):
    form=AddMusicForm()
    if request.POST:
        print("aaaaaaaaaaaaaaa")
        form=AddMusicForm(request.POST,request.FILES)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.owner = request.user
            instance.save()
            return HttpResponse(status=201)
    else:
        return render(
            request,
            template_name='form_pages_content/add_song_form.html',
            context={'form':form,},
            status=415,
        )


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


def playlist(request,playlist_id=None):
    # if the url = is just .../playlist then we return a form for creating a playlsit
    if request.method == "GET" and playlist_id == None:
        # obiectele FormModel din django nu face nimic altceva decat sa construiasca un html form ( doar continutul, tagul form tre sal punem singuri)
        n = len(Playlist.objects.filter(user=request.user))
        html_form = loader.render_to_string('app/forms/playlist_form.html',{'form':AddPlaylistForm(),"playlists_count":n},request)
        return HttpResponse(status=200,content = html_form)

    if request.method == "POST":
        # obiectele FormModel de asemenea se folosesc pentru a colecta datele din request, le verifica si le atribuie frumos in field-uri de care ne trebe noua
        form_data=AddPlaylistForm(request.POST,request.FILES)
        if form_data.is_valid():
            if not request.user.is_authenticated:
                return HttpResponse(status=401,content=json.dumps({'message':'User in not authenticated'}))
            instance = Playlist(**form_data.cleaned_data,user=request.user)
            instance.save()
            return HttpResponse(status=201, content=json.dumps({'message': "Playlist Created",'playlist': {"id":instance.id,"name":instance.name}}))
        else:
            return HttpResponse(status=406, content=json.dumps({'message': "Invalid data"}))

    if request.method == "GET":
        try:
            playlist = Playlist.objects.get(pk=playlist_id)
        except Playlist.DoesNotExist:
            return HttpResponse(status=404, content=json.dumps({'message': "Playlist Does Not Exist"}))

        songs = []
        for song in Playlist_group.objects.filter(playlist=playlist):
            songs.append(song.song)
        seconds = 0
        for song in songs:
            m,s = song.time_length.split(":")
            seconds += (int(m)*60) + int(s)
        total_duration = str(seconds//3600)+" hr " if seconds//3600>0 else str(seconds//60)+" min" if seconds//60>0 else ""
        profile = UserProfile.objects.get(user=playlist.user)
        response = loader.render_to_string('app/views/playlist.html', {'playlist':playlist,'songs':songs,"profile":profile,'total_duration':total_duration},request)
        return HttpResponse(content=response)
    
    if request.content_type != "application/json":
        return HttpResponse(status=406,content=json.dumps({'message':'Content Type Not Supported'}))
    data = json.loads(request.body.decode("utf-8"))

    if request.method == "PUT":
        return
    
    if request.method == "DELETE":
        
        try:
            playlist = Playlist.objects.get(pk=data["playlist"])
        except Playlist.DoesNotExist:
            return HttpResponse(status=404, content=json.dumps({'message': "Playlist Does Not Exist"}))

        if playlist.user == request.user:
            playlist.delete()
            return HttpResponse(status=204,content=json.dumps({'message':'The resource was successfully deleted'}))
        else:
            return HttpResponse(status=403,content=json.dumps({'message':'You are not the playlist owner'}))


def home_page_view(request):
    response = loader.render_to_string('app/views/home.html',{'home_songs':get_all_songs(),'playlist_list':get_playlist_list(request)},request)
    return HttpResponse(content=response) if request.path != reverse("musics:app") else response


def search(request):

    # is the url don't have a get data, then return the search html view
    if not request.GET:
        return HttpResponse(status=200,content=loader.render_to_string("app/views/search.html",{},request))
    try:
        key = request.GET["key"]
        value = request.GET["value"]
    except:
        return HttpResponse(status=406)

    if key not in ["song","album","artist","playlist","profile"]:
        return HttpResponse(status=406)

    if key=="song":
        songs = list(Music.objects.filter(title__icontains = value).values())
        for song in songs:
            song["album"] = Album.objects.filter(pk=song["album_id"]).values()[0] if song["album_id"] else None
            del song["album_id"]
            song["artist"] = Artist.objects.filter(pk=song["artist_id"]).values()[0]
            del song["artist_id"]
        return JsonResponse(songs,safe=False)
    if key=="artist":
        artists = list(Artist.objects.filter(name__icontains = value).values())
        return JsonResponse(artists,safe=False)
    if key=="album":
        return JsonResponse(list(Album.objects.filter(name__icontains = value).values()),safe=False)
    if key=="playlist":
        return JsonResponse(list(Playlist.objects.filter(name__icontains = value).values()),safe=False)
    if key=="profile":
        return JsonResponse(list(UserProfile.objects.filter(title__icontains = value).values()),safe=False)

    return HttpResponse(status=406,content=json.dumps({"message":"key not valid"}))
    

def main_menu(request):
    response = loader.render_to_string('app/menu.html',{'playlist_list':get_playlist_list(request),"profile":UserProfile.objects.get(user=request.user)},request)
    return HttpResponse(content=response) if request.path != reverse("musics:app") else response


def playlist_group(request):
    if request.content_type != "application/json":
        return HttpResponse(status=406,content=json.dumps({'message':'Content Type Not Supported'}))
    data = json.loads(request.body.decode("utf-8"))
    if request.method == 'POST':
        try:
            Playlist_group.objects.get(playlist=Playlist.objects.get(pk=data['playlist']),song=Music.objects.get(pk=data['song']))
            return HttpResponse(content=json.dumps({'message':"The resource didn't even exist"}))
        except Playlist_group.DoesNotExist:
            Playlist_group.objects.create(playlist=Playlist.objects.get(pk=data['playlist']),song=Music.objects.get(pk=data['song'])).save()
            return HttpResponse(content=json.dumps({'message':'The resource was successfully created'}))
        else:
            return HttpResponse(content=json.dumps({'message':'Unknown problem'}))
    if request.method == 'DELETE':
        instance = Playlist_group.objects.filter(playlist=data['playlist'],song=data['song'])
        if instance:
            instance.delete()
            return HttpResponse(status=204,content=json.dumps({'message':'The resource was successfully deleted'}))
        else:
            return HttpResponse(status=404,content=json.dumps({'message':'The resource was not found'}))
    return HttpResponse(status=405,content=json.dumps({'message':'Method Not Allowed'}))


def remove_from_playlist_view(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        if data['action'] == 'remove_from_playlist':
            try:
                Playlist_group.objects.filter(playlist=Playlist.objects.get(pk=data['playlist_id']),song=Music.objects.get(pk=data['song_id'])).delete()
                return HttpResponse(content=json.dumps({'message':'OK'}))
            except Playlist_group.DoesNotExist:
                pass
                
                
    return HttpResponse(status=415,content=json.dumps({'message':'ERROR'}))


def artist(request,artist_id=None):
    if request.method == "GET":
        try:
            if artist_id:
                artist = Artist.objects.get(pk=artist_id)
            else:
                artist = Artist.objects.get(user=request.user)
        except Artist.DoesNotExist:
            if request.GET.get("create",None):
                try:
                    artist = Artist.objects.get_or_create(user=request.user)[0]
                except Artist.unique_error_message:
                    return HttpResponse(status=406)
            else:
                return HttpResponse(status=404,content=json.dumps({'message':"Artist does not exist" if artist_id else "You don't have an artist profile"}))
        songs = Music.objects.filter(artist=artist)

        if not request.headers.get("Accept",None) or request.headers["Accept"] in ["","*","*/*","text/html"]:
            artist.dominant_color = json.loads(str(artist.image_colors).replace("'",'"'))[0]
            artist.tracks_count = songs.__len__
            response = loader.render_to_string("app/views/artist.html",{"artist":artist,"is_owner":artist.user==request.user,"songs":songs},request)
            return HttpResponse(content=response)
        elif request.headers["Accept"] == "application/json":
            songs = list(songs.values())
            for song in songs:
                if song["album_id"]:
                    song["album"] = Album.objects.filter(pk=song["album_id"]).values()[0]
                del song["album_id"]
                song["artist"] = Artist.objects.filter(pk=song["artist_id"]).values()[0]
                del song["artist_id"]
            return JsonResponse(songs,safe=False)
        
        else:
            return HttpResponse(status=406)

    if request.method == "POST":

        try:
            artist = Artist.objects.get(user=request.user)
        except Artist.DoesNotExist:
            return HttpResponse(status=404,content=json.dumps({'message':"You don't have an artist profile"}))

        form = ArtistForm(request.POST or None, request.FILES or None, instance=artist)
        if form.is_valid():
            artist.save()
            return HttpResponse(status=201, content=json.dumps({'message': ""}))
        return HttpResponse(status=406, content=json.dumps({'message': "OK"}))




########################################################################################
def get_playlist_list(request):
    exclude_id = get_main_playlist(request)["id"]
    playlist_list = list(Playlist.objects.filter(user=request.user.id).exclude(pk=exclude_id).values())
    for playlist in playlist_list:
        songs = list(Playlist_group.objects.filter(playlist=playlist['id']).values_list('song_id',flat=True))
        playlist['songs_count'] = len(songs)
        playlist['songs'] = songs
    return playlist_list

def get_main_playlist(request):
    try:
        main_playlist = Playlist.objects.filter(pk=LikedPlaylists.objects.get(user=request.user).playlist.pk).values()[0]
        songs = list(Playlist_group.objects.filter(playlist=main_playlist["id"]).values_list('song_id',flat=True))
        main_playlist['songs_count'] = len(songs)
        main_playlist['songs'] = songs
        return main_playlist
    except LikedPlaylists.DoesNotExist or Playlist.DoesNotExist:
        LikedPlaylists.objects.filter(user=request.user).delete()
        # new_playlist nu este la fel ca new_playlist.save() , isi pierde proprietetea de instanta a clasei dupa ce se salveaza
        #si nu mai poate fi folosit ca referinta pentru alte obiecte cu relatii 
        new_playlist = Playlist.objects.create(name='Liked Songs',user=request.user)
        new_playlist.cover_image = "playlist_img/liked-playlist-img.png"
        liked_playlist = LikedPlaylists.objects.create(user=request.user,playlist=new_playlist)
        new_playlist.save()
        liked_playlist.save()
        return get_main_playlist(request)


def get_scripts(folder):
    return [ str(static("musics"+"/"+folder+"/"+file)) for file in os.listdir(os.path.relpath('musics\\static\\musics'+'\\'+folder)) ]

def get_all_songs():
    songs = Music.objects.select_related('album').all().values()
    for song in songs:
        song["album"] = Album.objects.filter(pk=song["album_id"]).values()[0] if song["album_id"] else None
        del song["album_id"]
        song["artist"] = Artist.objects.filter(pk=song["artist_id"]).values()[0]
        del song["artist_id"]
    return list(songs)

from ast import arg
from musics.models import Album, Music
from django.shortcuts import redirect, render, get_object_or_404
from .form import AddMusicForm,ManageMusicForm,CreateUserForm
from django.contrib import messages  
from django.contrib.auth import authenticate, login, logout
from .decorators import logged_not_allowed, allowed_goups, admin_only, only_logged


@only_logged("You must be logged in to access the home page")
@allowed_goups(['full_admin','db_staff'])
def homePage(request):
    musics_list = list(Music.objects.select_related('album').all().values())
    for music in musics_list:
        if music["album_id"]!=None:
            music["album_name"]=Album.objects.get(id=music["album_id"]).name
        else:
            music["album_name"]='Single'
    return render(request,'home.html',{
        'musics_list':musics_list,
    })

@only_logged("Only those logged in can logout")
def logout_user(request):
    if request.POST:
        if request.POST.get('DA'):
            logout(request)
            return redirect('musics:login_user')
        if request.POST.get('NU'):
            return redirect('musics:home_page')
    return render(request,'logout_user.html')


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
    return render(request,'login_user.html')

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

    return render(request,'register_user.html',{'form':form,})

def addMusic(request):
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
                return redirect("music:home_page")
            else:
                instance.save()
                return redirect("music:home_page")

        else:
            print("no",form.data)
            print(form.errors.as_data())
    
    return render(request,'addPage.html',{
        'form':form,
    })

def delete_song(request,song_id):
    song=get_object_or_404(Music, pk=song_id)
    
    if request.POST:
        song.delete() 
        return redirect("music:home_page")
    return render(request,'delete_song.html',{'song':song})

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


    return render(request,'manage_song.html',{
        'form':form,
        'song':song,
    })
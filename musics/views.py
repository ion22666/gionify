from musics.models import Album, Music
from django.shortcuts import redirect, render
from django.http import JsonResponse
from .form import AddMusicForm
from .validators import validate_is_audio

def homePage(request):
    musics_list=list(Music.objects.all().values())
    bit_rate = validate_is_audio(Music.objects.filter(id=1))
    return render(request,'home.html',{
        'musics_list':musics_list,
        "bit_rate":bit_rate,
    })

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


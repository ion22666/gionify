#from musics.views import addMusic, homePage,manage_song,delete_song,register_user,login_user,logout_user,addSong#, musicList
from musics import views
from django.urls import path

app_name='musics'

urlpatterns = [
    path('',views.homePage,name='home_page'), 
    #path('add/',views.addMusic,name='add_music'),  
    path('register/',views.register_user,name='register_user'), 
    path('login/',views.login_user,name='login_user'),   
    path('logout/',views.logout_user,name='logout_user'),   
    path('manage/<int:song_id>/',views.manage_song,name='manage_song'),  
    path('delete/<int:song_id>/',views.delete_song,name='delete_song'),  
    path('addSong',views.addSong,name='getForm'),
    path('add_playlist',views.add_playlist_view,name='get_playlist_form'),
]

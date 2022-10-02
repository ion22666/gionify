from musics.views import addMusic, homePage,manage_song,delete_song,register_user,login_user,logout_user#, musicList
from django.urls import path

app_name='musics'

urlpatterns = [
    path('',homePage,name='home_page'), 
    path('add/',addMusic,name='add_music'),  
    path('register/',register_user,name='register_user'), 
    path('login/',login_user,name='login_user'),   
    path('logout/',logout_user,name='logout_user'),   
    path('manage/<int:song_id>/',manage_song,name='manage_song'),  
    path('delete/<int:song_id>/',delete_song,name='delete_song'),  
]

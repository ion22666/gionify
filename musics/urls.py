#from musics.views import addMusic, homePage,manage_song,delete_song,register_user,login_user,logout_user,addSong#, musicList
from musics import views
from django.urls import path

app_name='musics'

urlpatterns = [
    path('',views.homePage,name='home_page'), 
    path('register/',views.register_user,name='register_user'), 
    path('login/',views.login_user,name='login_user'),   
    path('logout/',views.logout_user,name='logout_user'),   
    path('manage/<int:song_id>/',views.manage_song,name='manage_song'),  
    path('delete/<int:song_id>/',views.delete_song,name='delete_song'),  
    path('addSong/',views.addSong,name='add_song_url'),
    path('add_playlist/',views.add_playlist_view,name='add_playlist_url'),
    path('user_request/',views.user_request_view,name='user_request_url'),
    path('liked/',views.liked_songs_view,name='liked_songs_page_url'),
]

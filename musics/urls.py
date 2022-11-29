from musics import views
from django.urls import path

app_name='musics'

urlpatterns = [
    path('',views.main,name='main'), 
    path('application/',views.application,name='app'), 
    path('register/',views.register_user,name='register_user'), 
    path('login/',views.login_user,name='login_user'),   
    path('logout/',views.logout_user,name='logout_user'),   
    path('manage/<int:song_id>/',views.manage_song,name='manage_song'),  
    path('delete/<int:song_id>/',views.delete_song,name='delete_song'),  
    path('addSong/',views.addSong,name='add_song_url'),
    path('playlist/',views.playlist,name='playlist'),
    path('playlist/<int:playlist_id>/',views.playlist,name='playlist'),
    path('user_request/',views.user_request_view,name='user_request_url'),
    path('liked/',views.liked_songs_view,name='liked_page'),
    path('home/',views.home_page_view,name='home_page'),
    path('profile/<user_name>/',views.profile_page_view,name='profile_page'),
    path('add_to_playlist/',views.add_to_playlist_view,name='add_to_playlist_url'),
    path('remove_from_playlist/',views.remove_from_playlist_view,name='remove_from_playlist_url'),
]

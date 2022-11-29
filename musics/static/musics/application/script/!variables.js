// some generals variables
var musics=JSON.parse(document.getElementById('musics_list').textContent)
var main_playlist_id=JSON.parse(document.getElementById('main_playlist_id').textContent)
var current_user=JSON.parse(document.getElementById('current_user').textContent)
var playlists=JSON.parse(document.getElementById('playlist_list').textContent)
var urls=JSON.parse(document.getElementById('url_patterns').textContent)


// music players elemente
var audio = document.querySelector('.audio_player')
var play=document.querySelector('.playing')
var currentTime=document.querySelector('.currentTime')
var duration=document.querySelector('.duration')
var progress=document.querySelector('.progress')
var progress_container=document.querySelector('.progress_container')
var audio_tracks=document.querySelector('.audio-tracks')
var song_title=document.querySelector('.song-title')
var artist=document.querySelector('.artist')
var album=document.querySelector('.album')
var music_img=document.querySelector('.music_img')

var progress_ball=document.querySelector('.progress_ball')
var add_song = document.getElementById('addSong_button')
var form_page = document.getElementById('form_page')
var song_img = document.querySelector('.song_img')
var close_img = document.querySelector('.close_img')
var open_img = document.querySelector('.open_img')

// for music player
var musicIndex = 0
var shuffle_status = false
var recently_played_list=[]

// butoanele principale din player
var play_pause=document.getElementById('playing')
var shuffle=document.getElementById('shuffle')
var prev=document.querySelector('.prev')
var next=document.querySelector('.next')


console.log('variables se executa')

// some generals variables
var tracks=JSON.parse(document.getElementById('musics_list').textContent);
var trackq = tracks;
var track = trackq[0];
var main_playlist=JSON.parse(document.getElementById('main_playlist_id').textContent);
var current_user=JSON.parse(document.getElementById('current_user').textContent);
var playlists=JSON.parse(document.getElementById('playlist_list').textContent);
var urls=JSON.parse(document.getElementById('url_patterns').textContent);


// music players elemente
var audio = document.querySelector('.audio_player');

// for music player
var musicIndex = 0;
var shuffle_status = false;
var recently_played_list=[];

// butoanele principale din player
var play_pause=document.getElementById('playing');
var shuffle=document.getElementById('shuffle');
var prev=document.querySelector('.prev');
var next=document.querySelector('.next');


console.log('variables se executa')

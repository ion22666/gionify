const player=document.querySelector('.audio-player')
const play=document.querySelector('.playing')
const prev=document.querySelector('.prev')
const next=document.querySelector('.next')
const currentTime=document.querySelector('.currentDuration')
const duration=document.querySelector('.Duration')
const progress=document.querySelector('.progress')
const progress_container=document.querySelector('.progress-container')
const audio_tracks=document.querySelector('.audio-tracks')
const song_title=document.querySelector('.song-title')
const artist=document.querySelector('.artist')
const album=document.querySelector('.album')
const music_img=document.querySelector('.music_img')
const play_icon=document.querySelector('.play_icon')
const pause_icon=document.querySelector('.pause_icon')

let musicIndex=2

const musics=JSON.parse(document.getElementById('musics_list').textContent)

// functions
// format time for music
const formatTime=secs=>{
let min = Math.floor((secs % 3600) / 60); 
let sec = Math.floor(secs % 60)
if (sec<10){
  sec=`0${sec}`
}

return `${min}:${sec}`
}

// loading a set detail of music in UI
const setSRC=()=>{
player.src=`/media/${musics[musicIndex].audio_file}`
song_title.textContent=musics[musicIndex].title
artist.textContent=musics[musicIndex].artiste 
music_img.setAttribute('src',`media/${musics[musicIndex].cover_image}`)

if(musics[musicIndex].album_name=="Single"){
    album.innerHTML='<span class="if_album">Single</span>'
}
else{
    album.innerHTML=musics[musicIndex].album_name + '<span class="if_album">album</span>'
}

}

//determine player should play or not 
const playOrPause=()=>{
if (player.paused){
    player.play()
    player.innerHTML = pause_icon

    
  }

  else{
    player.pause()
    player.innerHTML = play_icon

  }
}

// load first music
setSRC()
player.pause()
player.innerHTML = play_icon
// eventlisteners
// when play btn is clicked
play.addEventListener("click",e=>{

playOrPause()
})




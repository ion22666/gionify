const player=document.querySelector('.audio-player')
const play=document.querySelector('.playing')
const prev=document.querySelector('.prev')
const next=document.querySelector('.next')
const currentTime=document.querySelector('.currentTime')
const duration=document.querySelector('.duration')
const progress=document.querySelector('.progress')
const progress_container=document.querySelector('.progress_container')
const audio_tracks=document.querySelector('.audio-tracks')
const song_title=document.querySelector('.song-title')
const artist=document.querySelector('.artist')
const album=document.querySelector('.album')
const music_img=document.querySelector('.music_img')
const play_icon=document.querySelector('.play_icon')
const pause_icon=document.querySelector('.pause_icon')

let musicIndex=3

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

// setSRC() se apeleaza pentru a modifica src-ul audio-ului, dar in acelasi timp schimbam si informatile afisate pe pagina despre noua piesa
// cand un se shimba src-ul , se incepe de la inceput audioul , dar cu pauza
// setSRC() va folosi mereu variabila grobala musicIndex , pentru a determina care pisa sa se ruleze din lista de obiecte musics, care a fost citita din codul HTML unde a fost plasata de catre django

const setSRC=()=>{
player.src=`/media/${musics[musicIndex].audio_file}`
song_title.textContent=musics[musicIndex].title
artist.textContent=musics[musicIndex].artiste 
music_img.setAttribute('src',`media/${musics[musicIndex].cover_image}`)

if(musics[musicIndex].album_name=="Single"){
    album.innerHTML='<span>Single</span>'
}
else{
    album.innerHTML= '<span>' + musics[musicIndex].album_name + ' ' +  'album</span>'
}

}

//shimba play cu pause si invers
const playOrPause=()=>{
if (player.paused){
    player.play()
    play_icon.style.display = 'none'
    pause_icon.style.display = 'block'

    
  }

  else{
    player.pause()
    play_icon.style.display = 'block'
    pause_icon.style.display = 'none'

  }
}



// incarca prima piesa din lista cand se lanseaza pagina
setSRC()
// implicit va fi cu pauza
player.pause()



// eventlisteners
// butonul cu clasa play are doua iconite suprapuse, cand dam click pe el, una disapre si alta apare in dependenta daca playerul ruleza sau nu
play.addEventListener("click",e=>{ playOrPause() } )

// cand are loc o incarcare de metadata, adica cand se introduce un src, sectiunea 'duration' , va primi valoarea lungimii acelei piese incaracate
// player-ul este un tag de tip audio, si doar el poate avea proprietatea .duration
player.addEventListener('loadedmetadata',()=>{duration.textContent=formatTime(player.duration)})



// tag de tip audio poate oferi mereu timpul curent, astfel aflam cate % din intreg audioul sau rulat, si facem ca bara de muzica sa fie la aceasi ratie
player.addEventListener('timeupdate',()=>{
  let sec = player.currentTime
  let total = player.duration
  
  currentTime.textContent=formatTime(sec)
  let total_width = progress_container.offsetWidth
  let progress_value = progress.getAttribute('value')
  let audio_played = (sec/total)
  let new_value = 1000 * audio_played
  console.log(progress.getAttribute('value'))
  if(isNaN(audio_played)){

    progress.setAttribute('value','0')
  }
  else{
    progress.setAttribute('value',Math.floor(new_value))
  }
  
  console.log(progress.getAttribute('value'))
  
  if (audio_played==1){       //and if is the last song in a playlist
    progress.setAttribute('value','0')
    play_icon.style.display = 'block'
    pause_icon.style.display = 'none'
  }


})

// prev si next nu fac nimic altceva decat sa modifice musicIndex cu 1,dupa ce sa modificat indexul, 
// trebuie sa rulam si un setSRC() pentru a actualiza informatiile pe pagina cu piesa noua, altfel raman informatile de la piesa veche
// implicit dupa ce se seteaza un nou src, audioul este pe pauza , deci noi vrem ca sa se dea play automat si apelam playOrPause()
// folosim musics.length-1 pentru a determina ultimul index ( lenfgt-1 == ultimul index )
prev.addEventListener('click',()=>{
  musicIndex=musicIndex-1
  if(musicIndex<0){
    musicIndex=musics.length-1
  }
  if_paused = player.paused 
  setSRC()
  if (!if_paused){playOrPause()}
  progress.setAttribute('value','0')
})

next.addEventListener('click',()=>{
  musicIndex=musicIndex+1
  if(musicIndex>musics.length-1){
    musicIndex=0
  }

  if_paused = player.paused 
  setSRC()
  if (!if_paused){playOrPause()}
  progress.setAttribute('value','0')
})

// navigheaza prin piesa cu ajutorul barei de duratie/progres
//
progress_container.addEventListener('click',e=>{
  
  const where = (e.offsetX/progress_container.offsetWidth)

  progress.setAttribute('value',Math.floor(1000 * where))

  player.currentTime = player.duration * where
  
})



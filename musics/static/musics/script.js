const player=document.querySelector('.audio_player')
const play=document.querySelector('.playing')

const currentTime=document.querySelector('.currentTime')
const duration=document.querySelector('.duration')
const progress=document.querySelector('.progress')
const progress_container=document.querySelector('.progress_container')
const audio_tracks=document.querySelector('.audio-tracks')
const song_title=document.querySelector('.song-title')
const artist=document.querySelector('.artist')
const album=document.querySelector('.album')
const music_img=document.querySelector('.music_img')

const progress_ball=document.querySelector('.progress_ball')
const add_song = document.getElementById('addSong_button')
const form_page = document.getElementById('form_page')
const song_img = document.querySelector('.song_img')
const close_img = document.querySelector('.close_img')
const open_img = document.querySelector('.open_img')

let musicIndex = 0
let shuffle_status = false
let recently_played_list=[]

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








const setSRC=(was_paused)=>{
  
  fetch(`/media/${musics[musicIndex].audio_file}`)
  // Retrieve its body as ReadableStream
  .then((response) => {
    const reader = response.body.getReader();
    return new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
              controller.close();
              return;
            }
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            return pump();
          });
        }
      }
    })
  })
  // Create a new response out of the stream
  .then((stream) => new Response(stream))
  // Create an object URL for the response
  .then((response) => response.blob())
  .then((blob) => URL.createObjectURL(blob))
  .then((url) => {player.src = url;progress.style.width = "0px";if(was_paused != true){playOrPause()}})
  .catch(error=>{console.log(error)})

  song_title.textContent=musics[musicIndex].title
  artist.textContent=musics[musicIndex].artiste 
  manage_recently_played(musics[musicIndex].id)
  song_img.setAttribute('src',`/media/${musics[musicIndex].cover_image}`)
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
  }
  else{
    player.pause()
  }
}

function find_index(music_id){
  return musics.findIndex(function(item){
    return item.id == music_id
    })
  }

var manage_recently_played=function(new_played_id){
  
  function is_in_list(){
    return recently_played_list.findIndex(function(id){
      return id == new_played_id
      }
    )}


  if(is_in_list()!=-1){
    recently_played_list.splice(is_in_list(),1)
    recently_played_list.unshift(new_played_id)
  }else{
    recently_played_list.unshift(new_played_id)
    if(recently_played_list.length>6){recently_played_list.pop()}
  }




  for (let i = 0; i < recently_played_list.length; i++){
    index=find_index(recently_played_list[i])
    document.getElementById(i).innerHTML=`
    <td>${musics[index].id}</td> 
    <td>${musics[index].title}</td>
    <td>${musics[index].artiste}</td>
    <td>${musics[index].album_name}</td>
    `
  }
}


// incarca prima piesa din lista cand se lanseaza pagina

// implicit va fi cu pauza
player.pause()

// eventlisteners
// butonul cu clasa play are doua iconite suprapuse, cand dam click pe el, una disapre si alta apare in dependenta daca playerul ruleza sau nu

// cand are loc o incarcare de metadata, adica cand se introduce un src, sectiunea 'duration' , va primi valoarea lungimii acelei piese incaracate
// player-ul este un tag de tip audio, si doar el poate avea proprietatea .duration
player.addEventListener('loadedmetadata',()=>{duration.textContent=formatTime(player.duration)})



// tag de tip audio poate oferi mereu timpul curent, astfel aflam cate % din intreg audioul sau rulat, si facem ca bara de muzica sa fie la aceasi ratie

let temp = 0

player.addEventListener('timeupdate',()=>{

  temp = player.currentTime
  let sec = player.currentTime
  let total = player.duration
  
  currentTime.textContent=formatTime(sec)
  let total_width = progress_container.offsetWidth
  let audio_played = (sec/total)
  let new_width = total_width * audio_played
  
  progress.style.width = `${new_width}px`
  
  if (sec==player.duration){       //and if is the last song in a playlist
    player.play()
    document.getElementById('next').click()
    progress.style.width = `0px`
    play_icon.style.display = 'block'
    pause_icon.style.display = 'none'
  }


})






//seeking
progress_container.addEventListener('click',e=>{
    player.currentTime = player.duration * (e.pageX/progress_container.offsetWidth)
})



// navigheaza prin piesa cu ajutorul barei de duratie/progres
//
progress_container.addEventListener('mouseover',()=>{progress_ball.style.color = 'white';progress_ball.style.height = '1.5vh'})
progress_container.addEventListener('mouseout',()=>{progress_ball.style.height = '0vh'})




self.addEventListener("fetch", (event) => {
  console.log("Handling fetch event for", event.request.url);
})


document.querySelector('.song_img').addEventListener('mouseover',()=>{close_img.style.display = 'block'})
document.querySelector('.song_img').addEventListener('mouseout',()=>{close_img.style.display = 'none'})

document.querySelector('.close_img').addEventListener('mouseover',()=>{close_img.style.display = 'block'})
document.querySelector('.close_img').addEventListener('mouseout',()=>{close_img.style.display = 'none'})

function show_hide_img(){
  console.log("ttt")
  if(document.querySelector('.song_img_container').style.height == '0px'){
    document.querySelector('.song_img_container').style.height = '15vw'
    close_img.style.transform = 'translateY(0%)';
    open_img.style.display = 'none'
  }
  else{
    document.querySelector('.song_img_container').style.height = '0px'
    open_img.style.display = 'block'
    close_img.style.transform = 'translateY(-100%)';
  }
}
close_img.onclick = show_hide_img
open_img.onclick = show_hide_img
setSRC(true)


function create_function_for_each_play_buttons() {
  var buttons = document.getElementsByClassName('play_this_song_button');
  console.log(buttons)
  for ( var i in Object.keys( buttons ) ) {
      buttons[i].onclick = function() {
        musicIndex = find_index(this.value)
        setSRC(player.paused)
      };
  }
};

// create_function_for_each_play_buttons();

// function add_song_to_liked(){
//   musics.[musicIndex]
//   $.ajax({
//     type:"POST",
//     url:""
//   })
// }

// $('svg.liked_song_icon').click(()=)
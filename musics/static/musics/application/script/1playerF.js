
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

// dai update la inimioara in dependeta de piesa care acum ruleaza
function update_liked_icon(){
  if(playlists[main_playlist_id]['songs_id'].includes(musics[musicIndex].id)){
      document.getElementById('svg_not_liked_song').style.display = 'none'
      document.getElementById('svg_liked_song').style.display = 'block'
  }else{
      document.getElementById('svg_not_liked_song').style.display = 'block'
      document.getElementById('svg_liked_song').style.display = 'none'
  }
}


// setSRC() se apeleaza pentru a modifica src-ul audio-ului, dar in acelasi timp schimbam si informatile afisate pe pagina despre noua piesa
// cand un se shimba src-ul , se incepe de la inceput audioul , dar cu pauza
// setSRC() va folosi mereu letiabila grobala musicIndex , pentru a determina care pisa sa se ruleze din lista de obiecte musics, care a fost citita din codul HTML unde a fost plasata de catre django
function setSRC(was_paused){
    update_liked_icon();
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
    .then((url) => {player.src = url;if(was_paused != true){playOrPause()}})
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
  
function manage_recently_played(new_played_id){
    
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



// tag de tip audio poate oferi mereu timpul curent, astfel aflam cate % din intreg audioul sau rulat, si facem ca bara de muzica sa fie la aceasi ratie
function update_player(){
  let input = document.getElementById("progress_input")
  temp = player.currentTime
 
  input.value = (isNaN(player.duration)) ? 0:(player.currentTime/player.duration) * input.max; 

  if (player.currentTime==player.duration){
    player.play();
    document.getElementById('next').click();
  }
}
player.ontimeupdate = update_player

document.getElementById("progress_input").oninput = ()=>{player.ontimeupdate = null;};
document.getElementById("progress_input").onchange = (e)=>{
  player.ontimeupdate = update_player;
  player.currentTime = player.duration * (e.target.value/e.target.max)
}

// cand mouseul este in nautrul imaginii, iconita de inchide este vizibila
document.querySelector('.song_img').addEventListener('mouseover',()=>{close_img.style.display = 'block'})
document.querySelector('.song_img').addEventListener('mouseout',()=>{close_img.style.display = 'none'})
// cand mouseul este inafara imaginii, iconita de inchide este invizibila
document.querySelector('.close_img').addEventListener('mouseover',()=>{close_img.style.display = 'block'})
document.querySelector('.close_img').addEventListener('mouseout',()=>{close_img.style.display = 'none'})


function show_hide_img(){
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

// cand se da play la muzica, inonita de pause/play se schimba singura
player.addEventListener("play",()=>{
    $('#svg_pause').show();
    $('#svg_play').hide();
})
player.addEventListener("pause",()=>{
    $('#svg_pause').hide();
    $('#svg_play').show();
})

// punem si noi la inceput primul src de la index 0, true adica paused=true
setSRC(true)

// implicit va fi cu pauza
player.pause()

// eventlisteners
// butonul cu clasa play are doua iconite suprapuse, cand dam click pe el, una disapre si alta apare in dependenta daca playerul ruleza sau nu

// cand are loc o incarcare de metadata, adica cand se introduce un src, sectiunea 'duration' , va primi valoarea lungimii acelei piese incaracate
// player-ul este un tag de tip audio, si doar el poate avea proprietatea .duration
player.addEventListener('loadedmetadata',()=>{duration.textContent=formatTime(player.duration)})


// adauga sau elimina piesa de la favorite cand apesi pe inimioara,
document.getElementById('is_liked_song').addEventListener('click',()=>{
  let to_add = false
  if(document.getElementById('svg_liked_song').style.display != 'block'){
      to_add = true
  }
  add_or_remove_to_playlist(to_add,musics[musicIndex].id,main_playlist_id)
      .then((response)=>{
          playlists = response['get_playlist_list']
          update_liked_icon()
      })
      .catch((error)=>{console.log(error)})

})

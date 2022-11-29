console.log("se executa playerul");
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
    // update_liked_icon();
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
    .then((url) => {audio.src = url;if(was_paused != true){playOrPause()}})
    .catch(error=>{console.log(error)})
  
    // song_title.textContent=musics[musicIndex].title
    // artist.textContent=musics[musicIndex].artiste 
    // manage_recently_played(musics[musicIndex].id)
    // song_img.setAttribute('src',`/media/${musics[musicIndex].cover_image}`)
    // if(musics[musicIndex].album_name=="Single"){
    //     album.innerHTML='<span>Single</span>'
    // }
    // else{
    //     album.innerHTML= '<span>' + musics[musicIndex].album_name + ' ' +  'album</span>'
    // }
}


//shimba play cu pause si invers
const playOrPause=()=>{
  if (audio.paused){
      audio.play()
  }
  else{
    audio.pause()
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
progress_bar = document.querySelector("#player #range");
progress_container = document.querySelector("#player #progress");
function update_progress_bar(){
  progress_bar.style.width = (audio.currentTime/audio.duration*100).toString() + "%";
  if (audio.currentTime==audio.duration){
    audio.play();
    document.querySelector("#player #next").click();
  }
};
audio.ontimeupdate = update_progress_bar;


function update_audio(e){
  ratio = e.clientX/window.innerWidth;
  progress_bar.style.width = (ratio*100).toString()+"%";
  audio.currentTime = audio.duration * ratio;
};

progress_container.onclick = update_audio;
active_mouse = false;
progress_container.onmousedown = (e)=>{
  active_mouse = true;
  audio.ontimeupdate = null;
  
  setTimeout(_=>{if(active_mouse)progress_bar.classList.add("moving")},100);

  progress_bar.style.width = (e.clientX/window.innerWidth*100).toString()+"%";
  document.onmousemove = (e)=>{
    progress_bar.style.width = (e.clientX/window.innerWidth*100).toString()+"%";
  };

  document.onmouseup = (e)=>{
    active_mouse = false;
    audio.ontimeupdate = update_progress_bar;
    update_audio(e);
    document.onmousemove = null;
    document.onmouseup = null;
    progress_bar.classList.remove("moving");
  }
}


// punem si noi la inceput primul src de la index 0, true adica paused=true
setSRC(true)

// implicit va fi cu pauza
audio.pause()

// eventlisteners
// butonul cu clasa play are doua iconite suprapuse, cand dam click pe el, una disapre si alta apare in dependenta daca audioul ruleza sau nu

// cand are loc o incarcare de metadata, adica cand se introduce un src, sectiunea 'duration' , va primi valoarea lungimii acelei piese incaracate
// audio-ul este un tag de tip audio, si doar el poate avea proprietatea .duration
audio.onloadedmetadata = ()=>{
  document.querySelector("#player #total_time").textContent=formatTime(audio.duration);
}


play_icon = document.querySelector("#player #play");
pause_icon = document.querySelector("#player #pause");

play_icon.onclick = _=> audio.play();

pause_icon.onclick = _=> audio.pause();

audio.onplay = _=>{
  play_icon.classList.add("hide");
  pause_icon.classList.remove("hide");
}
audio.onpause = _=>{
  pause_icon.classList.add("hide");
  play_icon.classList.remove("hide");
}

document.querySelector("#player #picture #close").onclick = _=>{
  document.querySelector("#player #picture").classList.add("close");
  document.querySelector("#player #mini_picture").classList.remove("close");
};

document.querySelector("#player #mini_picture #open").onclick = _=>{
  document.querySelector("#player #mini_picture").classList.add("close");
  document.querySelector("#player #picture").classList.remove("close");
};

volume_container = document.querySelector("#player #volume");
volume_bar = document.querySelector("#player #volume #range");
volume_number = document.querySelector("#player #volume #number");

volume_icon = "medium";
function update_volume(e){
  ratio = (e.clientX - volume_container.offsetLeft) / volume_container.offsetWidth;
  ratio = (ratio<0)?0:(ratio>1) ? 1 : ratio;
  volume_bar.style.width = (ratio*100).toString()+"%";
  volume_number.innerText = Math.floor(ratio*100);
  audio.volume = ratio;
  update_volume_icon(ratio);
};
function update_volume_icon(r){
  icon = (r==0)?"mute":(r<0.33)?"low":(r<0.66)?"medium":"full";
  if(icon!=volume_icon){
    document.querySelector("#player #volume #"+volume_icon).classList.add("hide");
    document.querySelector("#player #volume #"+icon).classList.remove("hide");
    volume_icon=icon;
  };
};

volume_bar.style.width = (audio.volume*100).toString()+"%";
volume_number.innerText = Math.floor(audio.volume*100);
update_volume_icon(audio.volume);

volume_container.onclick = update_volume;

volume_container.onmousedown = (e)=>{
  active_mouse = true;
  setTimeout(_=>{if(active_mouse)volume_bar.classList.add("moving")},100);


  document.onmousemove = update_volume;

  document.onmouseup = _=>{
    active_mouse = false;
    document.onmousemove = null;
    document.onmouseup = null;
    volume_bar.classList.remove("moving");
  }
}
const play_pause=document.getElementById('playing')
const shuffle=document.getElementById('shuffle')
const prev=document.querySelector('.prev')
const next=document.querySelector('.next')



player.addEventListener("play",()=>{
    $('#svg_pause').show();
    $('#svg_play').hide();
})

player.addEventListener("pause",()=>{
    $('#svg_pause').hide();
    $('#svg_play').show();
})

document.getElementById('playing').addEventListener('click',()=>{
    playOrPause();
    console.log('aa')
})
// prev si next nu fac nimic altceva decat sa modifice musicIndex cu 1,dupa ce sa modificat indexul, 
// trebuie sa rulam si un setSRC() pentru a actualiza informatiile pe pagina cu piesa noua, altfel raman informatile de la piesa veche
// implicit dupa ce se seteaza un nou src, audioul este pe pauza , deci noi vrem ca sa se dea play automat si apelam playOrPause()
// folosim musics.length-1 pentru a determina ultimul index ( lenfgt-1 == ultimul index )

//PRIV
$('#prev').click(()=>{
    old_musicIndex = musicIndex
    if(shuffle_status){
    musicIndex = Math.floor(Math.random() * musics.length);
    if(musicIndex==old_musicIndex){musicIndex-=1}
    }

    else{musicIndex=musicIndex-1}
    if(musicIndex<0){
    musicIndex=musics.length-1
    }

    setSRC(player.paused)

    progress.style.width = '0px'
})

//NEXT
$('#next').click(()=>{
    console.log("aaaa")
    old_musicIndex = musicIndex
    if(shuffle_status){
    musicIndex = Math.floor(Math.random() * musics.length);
    if(musicIndex==old_musicIndex){musicIndex+=1}
    }
    else{musicIndex=musicIndex+1}

    if(musicIndex>musics.length-1){
    musicIndex=0
    }
    setSRC(player.paused)
    progress.style.width = '0px'
})

shuffle.addEventListener('click',()=>{
    if(shuffle_status){
    shuffle_status=false

    document.getElementById("shuffle").style.color = 'white'
    }else{
    shuffle_status=true
    document.getElementById("shuffle").style.color = 'rgb(22, 224, 107)'
    
    }

})
// dai update la inimioara in dependeta de piesa care acum ruleaza


async function add_or_remove_to_playlist(add,song_id,playlist_id){
    try{
        let response = await fetch(urls['user_request_url'],{
            method:'POST',
            headers: {'X-CSRFToken': csrftoken},
            body:JSON.stringify({
                'add':add,
                'song_id':song_id,
                'playlist_id':playlist_id
            })
        })
        let json_response = await response.json()
        return json_response
    }catch(e){
        alert(e)
    }
}   

// adauga sau elimina piesa de la favorite cand apesi pe inimioara,
document.getElementById('is_liked_song').addEventListener('click',()=>{
    let to_add = false
    if(document.getElementById('svg_liked_song').style.display != 'block'){
        to_add = true
    }
    add_or_remove_to_playlist(to_add,musics[musicIndex].id,playlists['main_playlist_id'])
        .then((response)=>{
            playlists = response['get_playlist_list']
            update_liked_icon()
        })
        .catch((error)=>{console.log(error)})

})


document.getElementById('liked_songs_page').addEventListener('click',()=>{
    fetch(urls['liked_songs_page_url'])
        .then((response)=>{return response.text()})
        .then((response)=>{
            console.log(typeof(response));
            console.log((response));
            document.getElementById('home_page').style.display = 'none'
            document.getElementById('liked_page').style.display = 'block'
            $('#liked_page').html(response)
            //document.getElementById('liked_page').innerHTML = response
            
        })
        .catch((error)=>{console.log(error)})
})

document.getElementById('liked_songs_page').addEventListener('click',()=>{
    fetch(urls['liked_songs_page_url'])
        .then((response)=>{return response.text()})
        .then((response)=>{
            console.log(typeof(response));
            console.log((response));
            document.getElementById('home_page').style.display = 'none'
            document.getElementById('liked_page').style.display = 'block'
            $('#liked_page').html(response)
            //document.getElementById('liked_page').innerHTML = response
            
        })
        .catch((error)=>{console.log(error)})
})
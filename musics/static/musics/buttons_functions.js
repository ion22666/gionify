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
function update_liked_icon(){
    if(playlists[main_playlist_id]['songs_id'].includes(musics[musicIndex].id)){
        document.getElementById('svg_not_liked_song').style.display = 'none'
        document.getElementById('svg_liked_song').style.display = 'block'
    }else{
        document.getElementById('svg_not_liked_song').style.display = 'block'
        document.getElementById('svg_liked_song').style.display = 'none'
    }
  }

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
    add_or_remove_to_playlist(to_add,musics[musicIndex].id,main_playlist_id)
        .then((response)=>{
            playlists = response['get_playlist_list']
            update_liked_icon()
        })
        .catch((error)=>{console.log(error)})

})



document.getElementById('home_page_button').addEventListener('click',()=>{
    fetch(urls['home_page_url'])
        .then((response)=>{return response.text()})
        .then((response)=>{
            document.getElementById('home_page').style.display = 'block'
            document.getElementById('liked_page').style.display = 'none'
            document.getElementById('profile_page').style.display = 'none'
            $('#home_page').html(response)
            
        })
        .catch((error)=>{console.log(error)})
})

document.getElementById('profile_button').addEventListener('click',()=>{
    fetch(urls['profile_page_url']+current_user)
        .then((response)=>{return response.text()})
        .then((response)=>{
            document.getElementById('home_page').style.display = 'none'
            document.getElementById('liked_page').style.display = 'none'
            document.getElementById('profile_page').style.display = 'block'
            $('#profile_page').html(response)
            
        })
        .catch((error)=>{console.log(error)})
})


function addEventListener_for_each(class_name,input_function) {
    var elements = document.getElementsByClassName(class_name);
    for ( var i in Object.keys( elements ) ) {
        elements[i].onclick = ()=>{input_function(this.property)}
    }
  };

function fetch_page(page_url,response_handler){
    fetch(page_url)
        .then((response)=>{return response.text()})
        .then((response)=>{response_handler(response)
        })
        .catch((error)=>{console.log(error)})
}

function display_page(content=null,page_name){
    let page_list = ['home_page','liked_page','playlist_page','profile_page']

    page_list.forEach(element=>{
        if(element==page_name){
            if(content){
                document.getElementById(page_name).style.display='block'
                $('#'+page_name).html(content)
            }else{
                document.getElementById(page_name).style.display='block'
            }
        }
        else{document.getElementById(element).style.display='none'}
    })

}

addEventListener_for_each('play_this_song_button',()=>{
    musicIndex = find_index(this.value)
    setSRC(player.paused)
});




// cand dam click pe like songs din menu, se face request si se plaseaza in main page
document.getElementById('liked_songs_page').addEventListener('click',()=>{
    fetch_page(urls['liked_songs_page_url'],(response)=>{
        display_page(response,'liked_page')
    })
})

// adaugam functia onclick pentru toate playlisturile din meniu si fiecare va face un request al lui si va plasa continutul in main page
for ( var i in document.getElementsByClassName('menu_playlist') ) {
    let item = document.getElementsByClassName('menu_playlist')[i]
    item.onclick = ()=>{
        fetch_page(urls['playlist_page_url']+item.value,(response)=>{
            display_page(response,'playlist_page')
        })
    }
}
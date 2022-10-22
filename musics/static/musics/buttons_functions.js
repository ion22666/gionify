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






//PRIV
prev.addEventListener('click',()=>{
    old_musicIndex = musicIndex
    if(shuffle_status){
    musicIndex = Math.floor(Math.random() * musics.length);
    if(musicIndex==old_musicIndex){musicIndex-=1}
    }
    else{musicIndex=musicIndex+1}
  
    if(musicIndex<0){
      musicIndex=musics.length-1
    }
  
    setSRC()
    if (player.paused == true){
      playOrPause()
    }
    progress.style.width = '0px'
  })
  
  //NEXT
  next.addEventListener('click',()=>{
    old_musicIndex = musicIndex
    if(shuffle_status){
    musicIndex = Math.floor(Math.random() * musics.length);
    if(musicIndex==old_musicIndex){musicIndex+=1}
    }
    else{musicIndex=musicIndex+1}
  
    if(musicIndex>musics.length-1){
      musicIndex=0
    }
    setSRC()
    if (player.paused == true){
      playOrPause()
    }
    progress.style.width = '0px'
  })
  
  
  
  shuffle.addEventListener('click',()=>{
    if(shuffle_status){
      shuffle_status=false
  
      shuffle.style.color = 'black'
    }else{
      shuffle_status=true
  
      shuffle.style.color = 'white'
    }
  
  })
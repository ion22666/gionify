const g = window.app;

let audio = g.audio;
let progress_bar = document.querySelector("#app #player #range");
let progress_container = document.querySelector("#app #player #progress");
let current_time = document.querySelector("#app #player #current_time");
let play_icon = document.querySelector("#player #play");
let pause_icon = document.querySelector("#player #pause");
let active_mouse = false;

let volume_container = document.querySelector("#player #volume");
let volume_bar = document.querySelector("#player #volume #range");
let volume_icon = "medium";

module.exports = ()=>{

    function update_progress_bar(){
        progress_bar.style.width = (audio.currentTime/audio.duration*100).toString() + "%";
        if (audio.currentTime == audio.duration){
            audio.play();
          document.querySelector("#app #player #next").dispatchEvent(new Event('click'));
        }
        current_time.innerText = g.formatTime(audio.currentTime);
    };

    audio.ontimeupdate = update_progress_bar;

    function update_audio(e){
        let ratio = e.clientX/window.innerWidth;
        progress_bar.style.width = (ratio*100).toString()+"%";
        audio.currentTime = audio.duration * ratio;
    };

    function update_audio_time(e){
        let ratio = e.clientX/window.innerWidth;
        current_time.innerText = g.formatTime(audio.duration * ratio)
    }
    progress_container.onclick = update_audio;

    
    progress_container.onmousedown = (e)=>{
        active_mouse = true;
        audio.ontimeupdate = null;
        
        setTimeout(_=>{if(active_mouse)progress_bar.classList.add("moving")},100);

        progress_bar.style.width = (e.clientX/window.innerWidth*100).toString()+"%";
        document.onmousemove = (e)=>{
            update_audio_time(e);
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

    audio.onloadedmetadata = ()=>document.querySelector("#player #total_time").textContent = g.formatTime(audio.duration);

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

    document.querySelector("#menu #picture #close").onclick = _=>{
        document.querySelector("#menu #picture").classList.add("close");
        document.querySelector("#player #mini_picture").classList.remove("close");
    };
      
    document.querySelector("#player #mini_picture #open").onclick = _=>{
        document.querySelector("#player #mini_picture").classList.add("close");
        document.querySelector("#menu #picture").classList.remove("close");
    };

    // input an event , bassed on his location we update the volume value
    function update_volume_by_click(e){
        r = (e.clientX - volume_container.offsetLeft) / volume_container.offsetWidth;
        r = (r<0)?0:(r>1) ? 1 : r;
        audio.volume = r;
    };
    // input volume value , and update the volume bar and volume number text
    function update_volume_bar(r){
        volume_bar.style.width = (r*100).toString()+"%";
        document.querySelector("#player #volume #number").innerText = Math.floor(r*100);
    }
    // input the volume value and update the icon
    function update_volume_icon(r){
        icon = (r==0)?"mute":(r<0.33)?"low":(r<0.66)?"medium":"full";
        if(icon!=volume_icon){
            document.querySelector("#player #volume #"+volume_icon).classList.add("hide");
            document.querySelector("#player #volume #"+icon).classList.remove("hide");
            volume_icon=icon;
        };
    };
    // when something change the volume, we update the icon and bar
    g.audio.addEventListener("volumechange", _ =>{
        update_volume_icon(audio.volume);
        update_volume_bar(audio.volume);
    })

    // add  onclick function for the volume bar container
    volume_container.onclick = update_volume_by_click;

    // the holding thing
    volume_container.onmousedown = (e)=>{
        active_mouse = true;
        setTimeout(_=>{if(active_mouse)volume_bar.classList.add("moving")},100);

        document.onmousemove = update_volume_by_click;

        document.onmouseup = _=>{
            active_mouse = false;
            document.onmousemove = null;
            document.onmouseup = null;
            volume_bar.classList.remove("moving");
        }
    }

    //PREV
    document.querySelector("#app #player #prev").onclick = ()=>{
        old_track = g.track;

        if(g.shuffle_status){
            while(g.track==old_track){
                g.track = g.trackq[Math.floor(Math.random() * g.trackq.length)];
            }
        }else{
            let index = g.trackq.findIndex((e)=>{return e==g.track})-1;
            index = (index<0) ? g.trackq.length-1:index;
            g.track=g.trackq[index];
        }
        audio.currentTime = 0;
        g.change_track(was_paused = audio.paused);
    }

    //NEXT
    document.querySelector("#app #player #next").onclick = ()=>{
        old_track = g.track;

        if(g.shuffle_status){
            while(g.track==old_track){
                g.track = g.trackq[Math.floor(Math.random() * g.trackq.length)];
            }
        }else{
            let index = g.trackq.findIndex((e)=>{return e==g.track})+1;

            index = (index>g.trackq.length-1) ? 0:index;

            g.track=g.trackq[index];
        }
        audio.currentTime = 0;
        g.change_track(was_paused = audio.paused);
    }

    // when shuffle is presed
    document.querySelector("#app #player #shuffle").onclick = ()=>{
        if(g.shuffle_status){
            g.shuffle_status=false;
            document.querySelector("#app #player #shuffle").classList.remove("active");
        }else{
            g.shuffle_status=true;
            document.querySelector("#app #player #shuffle").classList.add("active");
        }
    }

    // add_to_playlist button funtion
    document.querySelector("#app #player #add_to_playlist").onclick = event=>{

        let popup_screen = g.popup_screen;
        // creates a div inside #popup_screen and returns that div
        let menu = g.popup_screen.create_div(id="add_to_playlist",event=event);

        let pl_obj = [];
        let searchInput = document.createElement("input");
        searchInput.id = "playlist_search_input";
        searchInput.placeholder = "Search";
        searchInput.oninput = (e)=>{
            pl_obj.forEach(obj=>{
                //toggle(token, force), If force is included, turns the toggle into a one way-only operation. If set to false, then token will only be removed, but not added. If set to true, then token will only be added, but not removed. 
                obj.div.classList.toggle("hide",!obj.name.toLowerCase().includes(e.target.value.toLowerCase()))
            })
        };
        menu.appendChild(searchInput);
    
        let text_div = document.createElement("div");
        text_div.innerHTML = "select a playlist";
        text_div.id = "select_a_playlist";
        menu.appendChild(text_div);
    
        let block = document.createElement("div");
        block.className = "block";
        
    
        g.playlists.forEach(playlist => {
            if(!playlist.songs.includes(g.track.id)){
                let div = document.createElement("div");
                div.textContent = playlist.name;
                div.className = "playlist";
                div.onclick = _=>{
                    g.add_to_playlist(playlist.id,g.track.id)
                        .then(_=>popup_screen.hide_and_clean())
                        .catch(e=>alert(e))
                };
                block.appendChild(div);
                pl_obj.push({"name":playlist.name,"div":div})
            }
        });
        menu.appendChild(block);
        popup_screen.display();
    }
    
    // when empty heart is clicked
    document.querySelector("#app #player #empty_heart").onclick = _=> {
        g.add_to_playlist(g.main_playlist.id,g.track.id)
            .then((r)=>{
                if(r.ok){
                    document.querySelector("#app #player #empty_heart").classList.add("hide");
                    document.querySelector("#app #player #full_heart").classList.remove("hide");
                    if(!g.main_playlist.songs.includes(g.track.id))g.main_playlist.songs.push(g.track.id);
                }
            })
            .catch(e=>alert(e))
    }
    // when full heart is clicked
    document.querySelector("#app #player #full_heart").onclick = _=> {
        g.remove_from_playlist(g.main_playlist.id,g.track.id)
            .then((r)=>{
                if(r.ok){
                    document.querySelector("#app #player #empty_heart").classList.remove("hide");
                    document.querySelector("#app #player #full_heart").classList.add("hide");
                }
            })
            .catch(e=>alert(e))
    }
}   





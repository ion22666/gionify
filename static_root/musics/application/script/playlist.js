
// de fiecare data cand se intra la un playlist, se ruleaza functia asta
class PlaylistView extends View{
    static div = document.querySelector("#body #playlist");
    static url = urls["playlist"];
    static main_link = document.querySelector("#menu #home");
    static empty = true;

    // id of the playlist that is playing
    static active = null;
    // id of the playlist that exists in the #playlist div
    static on_screen = null;

    static active_row = null;
    static playlist_song_rows = [];

    
    static {
        super.make_link(['#menu .playlist']);
        audio.addEventListener("play",_=>{
            if(this.active_row){
                this.active_row.classList.remove("paused");
            }
            if(!this.empty && this.active==this.on_screen)this.update_icons(false);
        });
        audio.addEventListener("pause",_=>{
            if(this.active_row){
                this.active_row.classList.add("paused");
            }
            if(!this.empty && this.active==this.on_screen)this.update_icons(true);
        });
    }

    static setup(){
        PlaylistView.playlist_song_rows = document.querySelectorAll("#app #body #playlist .row.song");
        this.on_screen = document.querySelector("#app #body #playlist #head").dataset.id;
        this.update_gradient();

        try{
            document.querySelector("#body #playlist #body #space #play").onclick = _=>{
                if(this.active!=this.on_screen){
                    this.active=this.on_screen;
                    this.create_trackq();
                    track=trackq[0];
                    change_track(false);
                }
                audio.play();
            };
            document.querySelector("#body #playlist #body #space #pause").onclick = _=>{
                audio.pause();
            };
            if(this.active==this.on_screen)this.update_icons(audio.paused);
        }catch(e){}

        document.querySelector("#body #playlist #body #space #delete").onclick = _=>{
            delete_playlist(this.on_screen)
                .then(r=>{
                    if(r.status>=400){
                        alert(r.statusText);
                        return;
                    }
                    let menu_row = document.querySelector("#app #menu #playlists .active");
                    menu_row.parentElement.removeChild(menu_row);
                    document.querySelector("#app #menu #home").press();
                })
                .catch(e=>alert(e));
        };

        // bounding events to playlist song rows when th aplaylist page is generated
        (this.playlist_song_rows).forEach(row => {

            // if we find a row that matches the active_row from PlaylistView, then we give her the "active" class
            this.update_active();

            let block = row.querySelector(".front");
            block.onclick = _=>{
                if(row.classList.contains("active")){
                    this.create_trackq()
                    if(row.classList.contains("paused")){
                        audio.play();
                    }else{
                        audio.pause();
                    }
                }else{
                    this.active = document.querySelector("#app #body #playlist #head").dataset.id;
                    row.classList.add("active");
                    if(this.active_row)this.active_row.classList.remove("active");
                    this.active_row = row;
                    track=trackq[trackq.findIndex((e)=>{return e.id==parseInt(row.dataset.id)})];
                    change_track(false);
                    this.create_trackq()
                }
            }

            let trash = row.querySelector(".trash");
            trash.onclick = _=>{
                remove_from_playlist(this.on_screen,row.dataset.id)
                    .then(r=>{
                        row.parentElement.removeChild(row);
                        if(this.active==this.current_playlist()){
                            let index = trackq.findIndex(e=>{return e.id==row.dataset.id});
                            trackq.splice(index, 1);
                            if(row.dataset.id == track.id)document.querySelector("#player #next").dispatchEvent(new Event('click'));
                        }
                    })
                    .catch(e=>alert(e));
            }
        });
    }

    static update_active(){
        PlaylistView.playlist_song_rows.forEach(row => {
            if(track.id == row.dataset.id){
                PlaylistView.active_row = row;
                row.classList.add("active");
                return;
            }
            row.classList.remove("active");
        })
    }
    static create_trackq(){
        trackq=[]
        PlaylistView.playlist_song_rows.forEach(row => trackq.push(tracks.find(e=>{return e.id == row.dataset.id})))
    }
    static update_gradient(){
        var list = JSON.parse(document.querySelector("#body #playlist #head").dataset.colors.replace(/'/g, '"'))
        document.querySelector("#body #playlist #head").style.backgroundColor = `rgb(${list[0]})`;
        let body = document.querySelector("#body #playlist #body");
        body.style.background = `linear-gradient(0deg, ${window.getComputedStyle(body).getPropertyValue("background-color")} calc(100% - 12vmin), rgba(${list[0]},0.75) 100%)`;
    }
    static update_icons(paused){
        if(paused){
            document.querySelector("#body #playlist #body #space #play").classList.remove("hidden");
            document.querySelector("#body #playlist #body #space #pause").classList.add("hidden");
        }else{
            document.querySelector("#body #playlist #body #space #play").classList.add("hidden");
            document.querySelector("#body #playlist #body #space #pause").classList.remove("hidden");
        }
    }

}


// punem si noi la inceput primul src de la index 0, true adica paused=true
change_track(was_paused=true);
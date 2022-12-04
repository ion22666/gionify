
// de fiecare data cand se intra la un playlist, se ruleaza functia asta
class PlaylistView extends View{
    static div = document.querySelector("#body #playlist");
    static url = urls["playlist"];
    static main_link = document.querySelector("#menu #home");
    static empty = true;
    static active = null;
    static active_row = null;
    static playlist_song_rows = [];

    
    static {
        super.make_link(['#menu .playlist']);
        audio.addEventListener("play",_=>(PlaylistView.active_row)?PlaylistView.active_row.classList.remove("paused"):void(0));
        audio.addEventListener("pause",_=>(PlaylistView.active_row)?PlaylistView.active_row.classList.add("paused"):void(0));
    }

    

    static setup(){
        PlaylistView.playlist_song_rows = document.querySelectorAll("#app #body #playlist .row.song");

        var list = JSON.parse(document.querySelector("#body #playlist #head").dataset.colors.replace(/'/g, '"'))
        document.querySelector("#body #playlist #head").style.backgroundColor = `rgb(${list[0]})`;
        let body = document.querySelector("#body #playlist #body");
        body.style.background = `linear-gradient(0deg, ${window.getComputedStyle(body).getPropertyValue("background-color")} calc(100% - 12vmin), rgba(${list[0]},0.75) 100%)`;

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
                remove_from_playlist(document.querySelector("#app #body #playlist #head").dataset.id,row.dataset.id)
                    .then(r=>{
                        row.parentElement.removeChild(row);
                        if(this.active==document.querySelector("#app #body #playlist #head").dataset.id){
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
}


// punem si noi la inceput primul src de la index 0, true adica paused=true
change_track(was_paused=true);
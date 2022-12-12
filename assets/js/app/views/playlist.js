const View = require("../util/view");

const g = window.app;

class Playlist extends View{
    static div = document.querySelector("#body #playlist");
    static url = g.urls["playlist"];
    static main_link = document.querySelector("#menu #home");
    static empty = true;

    // id of the playlist that is playing
    static active = null;
    // id of the playlist that exists in the #playlist div
    static on_screen = null;
    // the song row that is currently active/playing
    static active_row = null;

    //  just a container for all the song rows from the playlist view
    static playlist_song_rows = [];

    
    static {
        super.make_link(['#menu .playlist']);
        g.audio.addEventListener("play",_=>{
            if(this.active_row){
                this.active_row.classList.remove("paused");
            }
            if(!this.empty && this.active==this.on_screen)this.update_icons(false);
        });
        g.audio.addEventListener("pause",_=>{
            if(this.active_row){
                this.active_row.classList.add("paused");
            }
            if(!this.empty && this.active==this.on_screen)this.update_icons(true);
        });
    }

    static setup(){
        this.playlist_song_rows = document.querySelectorAll("#app #body #playlist .row.song");
        this.on_screen = document.querySelector("#app #body #playlist #head").dataset.id;
        this.update_gradient();

        try{
            document.querySelector("#body #playlist #body #space #play").onclick = _=>{
                if(this.active!=this.on_screen){
                    this.active=this.on_screen;
                    this.create_trackq();
                    g.track = g.trackq[0];
                    g.change_track(false);
                }
                g.audio.play();
            };
            document.querySelector("#body #playlist #body #space #pause").onclick = _=>{
                g.audio.pause();
            };
            if(this.active==this.on_screen)this.update_icons(g.audio.paused);
        }catch(e){}

        let remove_playlist_icon = document.querySelector("#body #playlist #body #space #delete"); // the icon witch let user to delete the playlist
        if(this.on_screen==g.main_playlist.id){ // if this playlist is the main_playlist the, remove the delete playlis icon
            remove_playlist_icon.parentElement.removeChild(remove_playlist_icon);
        }else{ // if is not the main, thet dont delete it and add the onclick function to make a DELETE request
            remove_playlist_icon.onclick = _=>{
                g.delete_playlist(this.on_screen)
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
        }
        
        // bounding events to playlist song rows when th aplaylist page is generated
        (this.playlist_song_rows).forEach(row => {

            // if we find a row that matches the active_row from PlaylistView, then we give her the "active" class
            if(g.track.id == row.dataset.id){
                this.active_row = row;
                (g.audio.paused)? row.classList.add("active","paused") : row.classList.add("active");
            }else{
                row.classList.remove("active","paused");
            }
            
            let block = row.querySelector(".front");
            block.onclick = _=>{
                // if user click is in another playlist than the one currently playing
                if(this.active != this.on_screen){
                    this.create_trackq(); // update the trackq
                    this.active == this.on_screen; // update the active playlist
                }
                if(row.classList.contains("active")){ // if row is active, is the song that is now playing
                    if(row.classList.contains("paused")){ // if is paused play, else pause the audio
                        g.audio.play();
                    }else{
                        g.audio.pause();
                    }
                }else{ // if is not active, make it
                    row.classList.add("active");
                    if(this.active_row)this.active_row.classList.remove("active"); // remove active class from the old row
                    this.active_row = row; // update the active row
                    g.track = g.trackq[g.trackq.findIndex((e)=>{return e.id==parseInt(row.dataset.id)})]; // find the index of the row in the trackq
                    g.change_track(false); // and play it
                }
            }

            // for eash row, select the trash icon and add onclick function
            row.querySelector(".trash").onclick = _=>{
                // window.app.form
                g.remove_from_playlist(this.on_screen,row.dataset.id)// create a request to delete the song from the playlist, using the on_screen and the row data-id info
                    .then(r=>{
                        row.parentElement.removeChild(row);// remove the row from table
                        if(this.active == this.on_screen){ //if the playlist on screen is the same as the playlist that is playeng now
                            let index = g.trackq.findIndex(e=>{return e.id==row.dataset.id}); //find the index of the row/song that was deleted
                            g.trackq.splice(index, 1); // and removed from the trak queue
                            if(row.dataset.id == g.track.id)document.querySelector("#player #next").dispatchEvent(new Event('click')); //if the deleted song is was the song that was currently playng, do a next call
                        }
                    })
                    .catch(e=>alert(e));
            }
        });

        let user_div = this.div.querySelector("#user");
        user_div.onclick = _=>{
            g.profile.switch(super.with_fetch=true,super.url_param=user_div.dataset.id,super.element=(user_div.dataset.id==g.profile_id)?g.profile.main_link:null);
        }

        if(this.active==this.on_screen)this.update_icons(); // update the big play icon if active = on_screen
    }

    static update_active(){
        this.playlist_song_rows.forEach(row => {
            if(g.track.id == row.dataset.id){
                this.active_row = row;
                row.classList.add((g.audio.paused) ? ("active","paused") : "active");
                return;
            }
            row.classList.remove("active","paused");
        })
    }
    static create_trackq(){
        g.trackq=[];
        this.playlist_song_rows.forEach(row => g.trackq.push(g.tracks.find(e=>{return e.id == row.dataset.id})));
        this.active = this.on_screen;
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

module.exports = Playlist;
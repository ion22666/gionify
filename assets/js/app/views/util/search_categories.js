const Search = require("../search");

const block = document.querySelector("#app #body #search #results");

Results_Category_Setup = {
    "song":function(songs){

        const songs_block = block.querySelector("#songs");
        const counter = window.app.counter();
        if(!songs.length){
            songs_block.innerHTML = `<div id="empty">Nothing found&nbsp;<svg class="icon" id="sad" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/> </svg></div>`;
        }else{
            songs_block.innerHTML = `
                <div id="head" class="row">
                    <div id="counter">#</div>
                    <div id="title">TITLE</div>
                    <div>ARTIST</div>
                    <div>ALBUM</div>
                    <div></div>
                    <svg class=".icon" id="time" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>
                </div>
                <div id="body">
                </div>
            `;
            songs.forEach(insert_song);

            window.app.audio.addEventListener("play",full_search_rows_update);
            window.app.audio.addEventListener("pause",full_search_rows_update);
            // sa modifice paused, active, sa stearga active
        }

        function insert_song(song){
            let row = document.createElement("div");
            row.className = "row";
            row.innerHTML = `
                <div id="counter">${counter.next().value}</div>
                
                <svg class="icon" id="play" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
                <svg class="icon" id="pause" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/> </svg>
                
                <img src="media/${song.cover_image}" alt="">
                <div>${song.title}</div>
                <div>${song.artiste}</div>
                <div>${song.album_name}</div>

                <svg class="icon hide" id="full_heart" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/> </svg>
                <svg class="icon" id="empty_heart" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"> <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/> </svg>
                
                <div id="time">${song.time_length}</div>
            `;

            row.querySelector("#play").onclick = ()=>{
                window.app.playlist.active = "search_songs";
                window.app.trackq = songs;
                window.app.track = window.app.trackq[app.find_index(song.id)];
                window.app.change_track(false);
            }
            row.querySelector("#pause").onclick = ()=>{
                window.app.audio.pause();
            }
            songs_block.querySelector("#body").appendChild(row);
        }

        function full_search_rows_update(){
            if(window.app.playlist.active == "search_songs"){
                let rows = document.querySelectorAll("#app #body #search #results #songs #body .row");
                for (let i = 0; i < rows.length; i++) {
                    if(songs[i].id==window.app.track.id){
                        if(window.app.audio.paused){
                            rows[i].classList.add("active","paused")
                        }else{
                            rows[i].classList.add("active");
                            rows[i].classList.remove("paused");
                        }
                    }else{
                        rows[i].classList.remove("active","paused");
                    }
                }
            }
        }
    },

    "artists":function(){
        const songs_block = block.querySelector("#artists");
    },

    "playlists":function(){
        const songs_block = block.querySelector("#playlists");
    },

}

module.exports = Results_Category_Setup;
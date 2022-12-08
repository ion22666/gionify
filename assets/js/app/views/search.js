const View = require("../util/view");

class Search extends View{
    static div = document.querySelector("#app #body #search");
    static url = window.app.urls.search;
    static empty = true;

    static {
        super.make_link([
            '#menu #search',
        ])
    };

    static setup(){
        let search = this.div;
        let active_category = search.querySelector("#search_categories #songs");
        active_category.classList.add("active");
        let GET_key = "song"; // this will be the value for the key argument in the GET request

        search.querySelector("#search_bar #clean").onclick = ()=>{
            search.querySelector("#search_bar input").value = null;
        }

    
        // when a category is clicked, we make it active and update the GET_key
        search.querySelectorAll("#search_categories .category").forEach(category=>{
            category.onclick = ()=>{
                category.classList.add("active");
                active_category.classList.remove("active");
                active_category = category;

                GET_key = category.dataset.key;
            }
        })

        
        // when the search input text change
        let last_call_id = 0;
        search.querySelector("#search_bar input").oninput = async()=>{
            let input_id = ++last_call_id;
            await new Promise(resolve => setTimeout(resolve, 1500));
            if(last_call_id==input_id){
                let get = `?key=${GET_key}&value=${search.querySelector("#search_bar input").value}`;
                let songs = await (await fetch(window.app.urls.search+get)).json();
                if(!songs.length){
                    search.querySelector("#results #songs").innerHTML = `<div id="empty">Nothing found, sorry</div>`;
                }else{
                    search.querySelector("#results #songs").innerHTML = `
                        <div id="head">
                            <div>#</div>
                            <div id="title">TITLE</div>
                            <div>ARTIST</div>
                            <div>ALBUM</div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    `;
                    songs.forEach(insert_song);
                }
                
            }
        };

        const counter = (function* (){
            let count = 0;
            while (true) {
              yield ++count;
            }
        })();
        function insert_song(song){
            let row = document.createElement("div");
            row.className = "row";
            row.innerHTML = `
                <div class="counter">${counter.next().value}</div>
                
                <svg class="icon" id="play" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
                <svg class="icon" id="pause" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/> </svg>
                
                <img src="media/${song.audio_file}" alt="">
                <div>${song.title}</div>
                <div>${song.artiste}</div>
                <div>${(song.album_id)?song.album:"Single"}</div>

                <svg class="icon" id="full_heart" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/> </svg>
                <svg class="icon" id="empty_heart" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"> <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/> </svg>
                
                <div id="time">${song.time_length}</div>
            `;
            search.querySelector("#results #songs").appendChild(row);
        }
        
    }
}

module.exports = Search;
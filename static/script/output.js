/******/ var __webpack_modules__ = ({

/***/ "./assets/js/app/app.js":
/*!******************************!*\
  !*** ./assets/js/app/app.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Page = __webpack_require__(/*! ../core/page */ "./assets/js/core/page.js");

class App extends Page{
    static div = document.getElementById("app");
    static url = "application/";

    static active_view = null;
    static active_element = null;

    static async setup(){
        // variables
        this.main_playlist=JSON.parse(document.getElementById('main_playlist_id').textContent);
        this.profile_id=JSON.parse(document.getElementById('profile_id').textContent);
        this.playlists=JSON.parse(document.getElementById('playlist_list').textContent);
        this.urls=JSON.parse(document.getElementById('url_patterns').textContent);

        this.tracks=JSON.parse(document.getElementById('musics_list').textContent);
        this.trackq =  this.tracks;
        this.track =  this.trackq[0];
        this.track_index = 0;

        this.shuffle_status = false;
        this.audio = document.querySelector('.audio_player');
        this.prev=document.querySelector("#app #player #prev");
        this.next=document.querySelector("#app #player #next");

        this.Form = __webpack_require__(/*! ./util/FormClass */ "./assets/js/app/util/FormClass.js");
        this.form = __webpack_require__(/*! ./util/form */ "./assets/js/app/util/form.js");

        // general functions
        for (const [key, value] of Object.entries(__webpack_require__(/*! ./util/app_functions */ "./assets/js/app/util/app_functions.js"))){
            this[key] = value;
        }

        // player functions
        for (const [key, value] of Object.entries(__webpack_require__(/*! ./audio/player_functions */ "./assets/js/app/audio/player_functions.js"))){
            this[key] = value;
        }

        // this.CreatePlaylistForm = require("./menu/CreatePlaylistForm");

        // views
        this.home = __webpack_require__(/*! ./views/home */ "./assets/js/app/views/home.js");
        this.playlist = __webpack_require__(/*! ./views/playlist */ "./assets/js/app/views/playlist.js");
        this.search = __webpack_require__(/*! ./views/search */ "./assets/js/app/views/search.js");
        this.profile = __webpack_require__(/*! ./views/profile */ "./assets/js/app/views/profile.js");
        this.artist = __webpack_require__(/*! ./views/artist */ "./assets/js/app/views/artist.js");


        this.home.switch(super.with_fetch=true,super.url_param="",super.element=document.querySelector("#app #menu #home"));

        // menu setup
        __webpack_require__(/*! ./menu/menu */ "./assets/js/app/menu/menu.js")();
        
        // player setup
        __webpack_require__(/*! ./audio/player_setup */ "./assets/js/app/audio/player_setup.js")();
        this.change_track(this.track);

        

        this.audio.pause();
        this.audio.volume = 0.2;
    };
}

module.exports = App;

/***/ }),

/***/ "./assets/js/app/audio/player_functions.js":
/*!*************************************************!*\
  !*** ./assets/js/app/audio/player_functions.js ***!
  \*************************************************/
/***/ ((module) => {

const g = window.app;
function update_player_heart(){
    if(g.main_playlist.songs.includes(g.track.id)){
        document.querySelector("#app #player #empty_heart").classList.add("hide");
        document.querySelector("#app #player #full_heart").classList.remove("hide");
    }else{
        document.querySelector("#app #player #empty_heart").classList.remove("hide");
        document.querySelector("#app #player #full_heart").classList.add("hide");
    }
}
let old_track = null;
module.exports = {

    // change_track() se apeleaza pentru a modifica src-ul audio-ului, dar in acelasi timp schimbam si informatile afisate pe pagina despre noua piesa
    // cand un se shimba src-ul , se incepe de la inceput audioul , dar cu pauza
    // change_track() va folosi mereu letiabila grobala musicIndex , pentru a determina care pisa sa se ruleze din lista de obiecte trackq, care a fost citita din codul HTML unde a fost plasata de catre django
    async change_track(was_paused){
        if(old_track?.id==g.track?.id){
            (was_paused)?g.audio.pause():g.audio.play();
            return
        }
        old_track = g.track;
        
        g.audio.src = `media/${g.track.audio_file}`;
        document.body.style.cursor = "wait";
        await new Promise(resolve=>{
            g.audio.oncanplay = resolve;
        })
        document.body.style.cursor = "auto";

        
        if(!was_paused) g.audio.play();
        
        // fetch(`/media/${g.track.audio_file}`)
        // // Retrieve its body as ReadableStream
        // .then((response) => {
        //     const reader = response.body.getReader();
        //     return new ReadableStream({
        //         start(controller) {
        //             return pump();
        //             function pump() {
        //             return reader.read().then(({ done, value }) => {
        //                 // When no more data needs to be consumed, close the stream
        //                 if (done) {
        //                 controller.close();
        //                 return;
        //                 }
        //                 // Enqueue the next data chunk into our target stream
        //                 controller.enqueue(value);
        //                 return pump();
        //             });
        //             }
        //         }
        //     })
        // })
        // // Create a new response out of the stream
        // .then((stream) => new Response(stream))
        // // Create an object URL for the response
        // .then((response) => response.blob())
        // .then((blob) => URL.createObjectURL(blob))
        // .then((url) => {
        //     g.audio.src = url;
        //     if(!was_paused) g.audio.play();
        // })
        // .catch(error=>{alert(error)})
        
        document.querySelector("#app #player #title").textContent = g.track.title;
        document.querySelector("#app #player #artist").textContent = g.track.artist.name ;
        
        document.querySelector("#app #menu #picture img").src = `/media/${ g.track.cover_image }`;
        document.querySelector("#app #player #mini_picture img").src = `/media/${ g.track.cover_image }`;

        // if( g.playlist.active) g.playlist.update_active();

        g.playlist.update_active();
        update_player_heart();
    },

    // find the index of a trak in the trakQ
    find_index(music_id){
        return g.trackq.findIndex( item=> item.id == music_id );
    },



};

/***/ }),

/***/ "./assets/js/app/audio/player_setup.js":
/*!*********************************************!*\
  !*** ./assets/js/app/audio/player_setup.js ***!
  \*********************************************/
/***/ ((module) => {

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






/***/ }),

/***/ "./assets/js/app/menu/menu.js":
/*!************************************!*\
  !*** ./assets/js/app/menu/menu.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const create_playlist_form_setup = __webpack_require__(/*! ./playlist_form */ "./assets/js/app/menu/playlist_form.js");
const g = window.app;
function setup(){

    document.querySelector("#app #menu #dots").onclick = function(){
        if(this.classList.contains("open")){
            this.classList.remove("open");
            document.querySelector("#app #menu #options").classList.add("close");
        }else{
            this.classList.add("open");
            document.querySelector("#app #menu #options").classList.remove("close");
        }
        
    }

    document.querySelector("#app #menu #options #close").onclick = _=>{
        document.querySelector("#app #menu #dots").classList.remove("open");
        document.querySelector("#app #menu #options").classList.add("close");
    }

    {
        let menu = document.querySelector("#app #menu #options");
        menu.row = function(string){
            return this.querySelector(string);
        }


        menu.row("#logout").onclick = async _=>{
            let http_response = await fetch(window.app.urls.logout);
            if(http_response.status < 300){
                window.login.switch();
            }
        }
        menu.row("#user_profile").onclick = _=>{
            window.app.profile.switch(with_fetch=true,element=document.querySelector("#app #menu #block #profile"));
            document.querySelector("#app #menu #dots").classList.remove("open");
            document.querySelector("#app #menu #options").classList.add("close");
        }
        menu.row("#artist_profile").onclick = _=>{
            window.app.artist.switch(with_fetch=true,element=document.querySelector("#app #menu #block #profile"));
            document.querySelector("#app #menu #dots").classList.remove("open");
            document.querySelector("#app #menu #options").classList.add("close");
        }

    }
    



    document.querySelector("#app #menu #create_playlist").onclick = create_playlist_form_setup;
    document.querySelector("#app #menu #liked").onclick = _=>g.playlist.switch(with_fetch=true, url_param=g.main_playlist.id,element=document.querySelector("#app #menu #liked"));

}


module.exports = setup;

/***/ }),

/***/ "./assets/js/app/menu/playlist_form.js":
/*!*********************************************!*\
  !*** ./assets/js/app/menu/playlist_form.js ***!
  \*********************************************/
/***/ ((module) => {

const g = window.app;

async function setup(){
    
    let popup_screen = g.popup_screen; // connect to popup_screen div

    popup_screen.self.innerHTML =  await (await fetch(g.urls.playlist)).text(); // fill the popup_screen with the form from server

    // begin the inside form setup
    (()=>{
        let form = popup_screen.self.querySelector("#create_playlist"); 
        form.onsubmit = async(event)=>{
            event.preventDefault();
            let form_data = new FormData(event.target)
            let http_respose = await fetch(g.urls.playlist,{method: "POST", body: form_data});
            if(http_respose.status < 300){
                let div = document.createElement("div");
                let json_respose = await http_respose.json();
                div.innerHTML = `<div class="playlist" data-url_param="${json_respose.playlist.id}">${json_respose.playlist.name}</div>`;
                document.querySelector("#app #menu #playlists").appendChild(div);
                window.app.playlist.make_link(['#menu .playlist']);
                popup_screen.hide_and_clean();
            }
            return http_respose;
        }

        var file_input = form.querySelector("#id_cover_image"); // the form input that require a file/img upload
        
        var selected_file_display = form.querySelector("#uploaded_file"); // the div that display the name of the selected file
        file_input.onchange = (e)=>{
            selected_file_display.innerHTML = '<span> selected file: </span>' + file_input.files[0].name;
        }
        
        let playlist_name_input = document.querySelector("#app #popup_screen #create_playlist #id_name"); // the form input that require the name of the new playlist
        document.querySelector("#app #popup_screen #create_playlist input[type=submit]").onclick = _ =>{
            if(playlist_name_input.value == "") playlist_name_input.value = playlist_name_input.placeholder;
        }
    })();
    
    popup_screen.display();
}

module.exports = setup;

/***/ }),

/***/ "./assets/js/app/util/FormClass.js":
/*!*****************************************!*\
  !*** ./assets/js/app/util/FormClass.js ***!
  \*****************************************/
/***/ ((module) => {

class Form{
    static hide(){
      document.querySelector("#app #form_screen").classList.add("hide");
      document.querySelector("#app #form_screen").innerHTML = "";
    }
  
    static async dispaly(){
      let form = await(await fetch(this.url)).text();
      document.querySelector("#app #form_screen").innerHTML = form;
      document.querySelector("#app #form_screen .form").onsubmit = async(event)=>{

          try{
              event.preventDefault();
              let form_data = new FormData(event.target)
              let http_respose = await fetch(this.url,{method: this.method, body: form_data});
              Form.hide();
              return;
          }catch(e){alert(e)}
      }
      document.onclick = (e)=>{
          if(e.target.id == "form_screen"){
              Form.hide();
              document.onclick = null;
          }
      }
      this.setup();
      document.querySelector("#app #form_screen").classList.remove("hide");
    }
  
    static make_link(elements){

      elements.forEach(query => document.querySelectorAll(query).forEach(e => e.onclick = _ => this.dispaly()));
    }
}

module.exports = Form;

/***/ }),

/***/ "./assets/js/app/util/app_functions.js":
/*!*********************************************!*\
  !*** ./assets/js/app/util/app_functions.js ***!
  \*********************************************/
/***/ ((module) => {

const [add_to_playlist,remove_from_playlist] = (_=>{
    let f = (method)=>{
        return async(playlist,song)=>{
            return await fetch(window.app.urls.playlist_group,{
                headers:{
                    "Content-Type":"application/json",
                    "X-CSRFToken":window.app.getCookie("csrftoken")
                },
                method:method,
                body:JSON.stringify({
                    playlist : playlist,
                    song : song
                })

            })
        }
    }
    return [f("POST"),f("DELETE")]
})();

function* generator(start=1){
    yield start++;
    yield* generator(start);
};

module.exports = {
    
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    },

    add_to_playlist:add_to_playlist,
    remove_from_playlist:remove_from_playlist,
    
    async delete_playlist(playlist){
        return await fetch(window.app.urls.playlist,{
            headers:{
                "Content-Type":"application/json",
                "X-CSRFToken":window.app.getCookie("csrftoken")
            },
            method:"DELETE",
            body:JSON.stringify({
                playlist : playlist
            })
        })
    },

    formatTime(secs){
        let min = Math.floor((secs % 3600) / 60); 
        let sec = Math.floor(secs % 60);
        (sec<10)?sec=`0${sec}`:void(0);
        return `${min}:${sec}`
    },

    popup_screen:(_=>{

        let popup_screen = document.querySelector("#app #popup_screen");
        // popup_screen.onmousemove = (e) => popup_screen.style.backdropFilter = (e.target == popup_screen) ? "brightness(1.3)" : "brightness(1)";
        
        function create_div(id,event=None,center=false){
            let div = document.createElement("div");
            div.id = id;
            div.classList.add("popup_div");
            popup_screen.appendChild(div);
            if(event){
                div.style.top =  (event.clientY).toString() +"px";
                div.style.left = (event.clientX).toString() +"px";
            }
            setTimeout(() => {
                document.onclick = e => (e.target == popup_screen) ? hide_and_clean():void(0);
            }, 260);
            return div;
        };

        function display(background_color="rbga(0,0,0,0.8)"){
            popup_screen.style.backgroundColor = background_color;
            popup_screen.classList.remove("hide");
            document.onclick = e =>{(e.target == popup_screen) && hide_and_clean()};
        };

        function hide(){
            document.onclick = null;
            popup_screen.classList.add("hide");
        };

        function clean(){
            popup_screen.innerHTML = null;
        };

        function hide_and_clean(){
            hide();
            clean();
        };
    
        return {
            self:popup_screen,
            create_div:create_div,
            display:display,
            hide:hide,
            clean:clean,
            hide_and_clean:hide_and_clean,
        };
    })(),

    counter:generator,
}











/***/ }),

/***/ "./assets/js/app/util/form.js":
/*!************************************!*\
  !*** ./assets/js/app/util/form.js ***!
  \************************************/
/***/ (() => {



/***/ }),

/***/ "./assets/js/app/util/view.js":
/*!************************************!*\
  !*** ./assets/js/app/util/view.js ***!
  \************************************/
/***/ ((module) => {

class View{

    // ascunde div-ul clasei din care este apelata aceasta functie
    static hide(element){
        this.div.classList.add("hide");
        element&&element.classList.remove("active");
    }
    static dispaly(element){
        this.div.classList.remove("hide");
        element&&element.classList.add("active");
    }

    // se da display la div-ul clasei din care se apeleaza
    static async switch(with_fetch=false, url_param="",element){

        if (with_fetch){

            // daca fetch este true, dam fetch si inseram continutul div-ului   
            this.div.innerHTML = await (await fetch(this.url+((url_param)?(url_param):""))).text();

            // by default doar prima data se da fetch cand apasam pe un link
            this.empty = false;
            // de fiecare data cand cand dam fetch, rulam sau mai rulam odata setupul clasei
            this.setup();
        }
        await window.wait_img(this.div);

        // mai intai se ascunde div-ul clasei vechi
        try{window.app.active_view.hide(window.app.active_element);}catch(e){};

        this.dispaly(element)

        // actualizam clasa activa
        window.app.active_view = this;
        window.app.active_element = element;
    }

    // creaza link pentru fiecare element inclus in lista
    // link = cand apesi se da display
    // parametrul fetch depinde de atributa clasei "empty", empty devine false cand sa realizat primul fetch al clasei
    static make_link(elements,element=null){
        elements.forEach(query => document.querySelectorAll(query).forEach(e => e.onclick = _ => this.switch(super.with_fetch = (e.dataset.url_param)? true : this.empty, super.url_param=e.dataset.url_param,super.element=e)))
    }
}

module.exports = View;

/***/ }),

/***/ "./assets/js/app/views/artist.js":
/*!***************************************!*\
  !*** ./assets/js/app/views/artist.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const View = __webpack_require__(/*! ../util/view */ "./assets/js/app/util/view.js");
const g = window.app;

class Artist extends View{
    static div = document.querySelector("#app #body #artist");

    static url = window.app.urls.artist;
    static empty = true;

    static async setup(){
        const artist_view = this.div;
        const artist_songs = await (await fetch(window.app.urls.artist+artist_view.querySelector("meta[name=artist_id]").content,{headers:{"Accept":"application/json"}})).json();

        artist_view.querySelector("main section #follow").onclick = function(){
            this.classList.toggle("followed")
        }
        

        let [play,pause]= artist_view.querySelectorAll("main section .icon")

        play.onclick = function(){
            g.trackq = artist_songs;
            g.track = artist_songs[0];
            g.change_track(false);
            play.classList.add("hidden");
            pause.classList.remove("hidden");
        }

        pause.onclick = function(){
            play.classList.remove("hidden");
            pause.classList.add("hidden");   
        }

        let selected_category = artist_view.querySelector("#block1 #content #categories .category.active");
        artist_view.querySelectorAll("#block1 #content #categories .category").forEach(category=>{
            category.onclick = function(){
                selected_category&&selected_category.classList.remove("active");
                artist_view.querySelector("#block1 #content #categories_body #"+selected_category.id).classList.add("hide");

                selected_category=category;

                category.classList.add("active");
                artist_view.querySelector("#block1 #content #categories_body #"+category.id).classList.remove("hide");
            }
        })

    }
}
module.exports = Artist;

/***/ }),

/***/ "./assets/js/app/views/home.js":
/*!*************************************!*\
  !*** ./assets/js/app/views/home.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const View = __webpack_require__(/*! ../util/view */ "./assets/js/app/util/view.js");

class Home extends View{
    static div = document.querySelector("#body #home");
    static url = window.app.urls["home_page"];
    static empty = true;

    static row_index = 0;


    static {
        super.make_link([
            '#menu #home',
        ])
    }

    static change_release_song(){
        
        let current_row = (document.querySelector("#body #home #new_releases #tbody").children)[this.row_index];
        document.querySelector("#body #home #new_releases #title").innerHTML = `${current_row.dataset.title} <div id="album">${current_row.dataset.album}</div>`;
        document.querySelector("#body #new_releases #artist").textContent = current_row.dataset.artist;

        document.querySelector('#body #home #new_releases img').src = current_row.dataset.img;
        let list = JSON.parse(current_row.dataset.colors.replace(/'/g, '"'))
        document.querySelector('#body #home #new_releases').style.background = `linear-gradient(90deg, rgba(${list[0]},1) 0%, rgba(${list[2]},1) 100%)`;    
    }
    
    static setup(){
        this.change_release_song(this.row_index)
        document.querySelector('#body #home #new_releases #next').onclick = _=>{this.row_index-=1;this.change_release_song()}
        document.querySelector('#body #home #new_releases #prev').onclick = _=>{this.row_index+=1;this.change_release_song()}
    }
}

module.exports = Home;

/***/ }),

/***/ "./assets/js/app/views/playlist.js":
/*!*****************************************!*\
  !*** ./assets/js/app/views/playlist.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const View = __webpack_require__(/*! ../util/view */ "./assets/js/app/util/view.js");

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

/***/ }),

/***/ "./assets/js/app/views/profile.js":
/*!****************************************!*\
  !*** ./assets/js/app/views/profile.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const View = __webpack_require__(/*! ../util/view */ "./assets/js/app/util/view.js");
const create_profile_edit_form = __webpack_require__(/*! ./util/create_profile_edit_form */ "./assets/js/app/views/util/create_profile_edit_form.js");

class Profile extends View{
    static div = document.querySelector("#app #body #profile");
    static main_link = document.querySelector("#app #menu #profile");
    static url = window.app.urls.profile;
    static empty = true;

    static {
        super.make_link([
            '#menu #profile',
        ])
    };
    static async setup(){
        const edit_div = this.div.querySelector("#head #edit");
        
        edit_div.onclick = create_profile_edit_form;

        this.div.querySelector("#head #go_to_artist").onclick = async function(){
            
            if(this.dataset.is_artist=="False"){
                document.body.style.cursor = "wait";
                let r = await fetch(window.app.urls.artist+"?create=true");
                document.body.style.cursor = "auto";
                if(r.status>300)return;
            }
            
            window.app.artist.switch(true,"",document.querySelector("#app #menu #block #profile"));
        }
    }
}


module.exports = Profile;

/***/ }),

/***/ "./assets/js/app/views/search.js":
/*!***************************************!*\
  !*** ./assets/js/app/views/search.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const View = __webpack_require__(/*! ../util/view */ "./assets/js/app/util/view.js");

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
        let active_category = null;
        let active_category_block = null;

        let GET_key = "song"; // this will be the value for the key argument in the GET request

        const Results_Category_Setup = __webpack_require__(/*! ./util/search_categories */ "./assets/js/app/views/util/search_categories.js");

        // when the X icons is clicked
        search.querySelector("#search_bar #clean").onclick = ()=>{
            search.querySelector("#search_bar input").value = null;
        }

    
        // when a category is clicked, we make it active , update the GET_key and display the results block
        search.querySelectorAll("#search_categories .category").forEach(category=>{
            category.onclick = ()=>{

                category.classList.add("active");
                active_category?.classList.remove("active");
                active_category = category;

                active_category_block?.classList.add("hide");
                active_category_block = search.querySelector("#results #"+category.id);
                active_category_block.classList.remove("hide");

                GET_key = category.dataset.key;
            }
        })

        
        // when the search input text change
        let last_call_id = 0;
        search.querySelector("#search_bar input").oninput = async()=>{
            let input_id = ++last_call_id;
            await new Promise(resolve => setTimeout(resolve, 1000));
            if(last_call_id==input_id&&search.querySelector("#search_bar input").value){
                let get = `?key=${GET_key}&value=${search.querySelector("#search_bar input").value}`;
                let json_response = await (await fetch(window.app.urls.search+get)).json();

                // run the coeresponding setup, depending on the GET_key
                Results_Category_Setup[GET_key](json_response);
            }
        };

        search.querySelector("#search_categories #songs").press();
    }
}

module.exports = Search;

/***/ }),

/***/ "./assets/js/app/views/util/create_profile_edit_form.js":
/*!**************************************************************!*\
  !*** ./assets/js/app/views/util/create_profile_edit_form.js ***!
  \**************************************************************/
/***/ ((module) => {

async function setup(){
    const g = window.app;
    const popup_screen = g.popup_screen; // connect to popup_screen div
    let old_username = document.querySelector("#app #body #profile #head #username");
    let old_picture = document.querySelector("#app #body #profile #head img");
    
    popup_screen.self.innerHTML = await (await fetch(window.app.urls.profile)).text();

    let form = popup_screen.self.querySelector("#edit_profile"); 

    // form.querySelector("img").src = old_picture.src;
    // form.querySelector("input[type=text]").value = old_username.textContent;
    // form.querySelector("input[type=text]").placeholder = old_username.textContent;


    document.querySelector("#app #popup_screen #close").onclick = _=>setTimeout(popup_screen.hide_and_clean,200) ;


    // the setup for the uploading of the profile picture
    {
        let file_input = document.querySelector("#app #popup_screen label input[type=file]");
        let img_element = document.querySelector("#app #popup_screen label img");

        // The FileReader is part of the File API witch enables web applications to access files and their contents.
        let reader = new FileReader();
        
        file_input.onchange = _=>file_input.files && reader.readAsDataURL(file_input.files[0]);

        //evry time the reader object loads a file, this function will run
        reader.onload = _=> img_element.src = reader.result;
    }
    // on form submit
    {
        form.onsubmit = async(event)=>{

            event.preventDefault();
            let form_data = new FormData(event.target)
            if(form_data.get("name")!=old_username.textContent || form_data.get("picture").name){
                let http_respose = await fetch(g.urls.profile+g.profile_id,{method: "POST", body: form_data});
                if(http_respose.status < 300){
                    popup_screen.hide_and_clean();
                    window.app.profile.switch(with_fetch=true,url_param=window.app.profile_id,element=window.app.profile.main_link)
                }else{
                    console.error(http_respose);
                }
            }else{
                popup_screen.hide_and_clean();
            }
        }
    }
    

    popup_screen.display();
}

module.exports = setup;

/***/ }),

/***/ "./assets/js/app/views/util/search_categories.js":
/*!*******************************************************!*\
  !*** ./assets/js/app/views/util/search_categories.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Search = __webpack_require__(/*! ../search */ "./assets/js/app/views/search.js");

const block = document.querySelector("#app #body #search #results");

Results_Category_Setup = {
    "song":function(songs){
        const songs_block = document.querySelector("#app #body #search #results #songs");
        console.log("songs", songs, songs_block);
        const counter = window.app.counter();
        console.log("1111", songs_block);
        if(!songs.length){
            songs_block.innerHTML = `<div id="empty">Nothing found&nbsp;<svg class="icon" id="sad" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/> </svg></div>`;
        }else{
            console.log("2222", songs_block);
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
            console.log("3333", songs_block);
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
                <div>${song.artist.name}</div>
                <div>${song.album?.name??"Single"}</div>

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

/***/ }),

/***/ "./assets/js/core/page.js":
/*!********************************!*\
  !*** ./assets/js/core/page.js ***!
  \********************************/
/***/ ((module) => {

const loading_screen = {
    div : document.querySelector('#loading_screen'),

    hide(){
        this.div.classList.add("hide");
    },

    dispaly(){
        this.div.classList.remove("hide");
    },

    appear(){
        $('#loading_screen').animate({opacity:"1"});
        return new Promise(resolve=>this.div.ontransitionend = resolve)
    },

    disappear(){
        $('#loading_screen').animate({opacity:"0"});
        return new Promise(resolve=>this.div.ontransitionend = resolve)
    }
};

class Page{
    static active_page = null;
    static hide(){
        this.div.classList.add("hide");
    }
    static dispaly(){
        this.div.classList.remove("hide");
    }
    static delete_content(){
        this.div.innerHTML = null;
    }
    static async switch(with_fetch=true){

        let old_page = window.active_page;
        let new_page = this;

        // if redirected, loading_screen is alredy displayed
        if(loading_screen.div.classList.contains("hide")){
            loading_screen.dispaly();
            await loading_screen.appear();
        }

        // if old_page is not null or undefined then run old_page.hide()
        old_page?.hide();

        if(with_fetch){
            let http_response = await fetch(new_page.url);

            if (http_response.redirected){
                if(http_response.url.match(/login/i))new_page = window.login;
            }

            new_page.div.innerHTML = await http_response.text();
        }

        old_page?.hide();
        window.active_page = new_page;
        new_page.setup();
        new_page.dispaly();
        await window.wait_img(new_page.div);
        await loading_screen.disappear();
        loading_screen.hide();
        __webpack_module_cache__ = {};
    }
}

module.exports = Page;

/***/ }),

/***/ "./assets/js/login/login.js":
/*!**********************************!*\
  !*** ./assets/js/login/login.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Page = __webpack_require__(/*! ../core/page */ "./assets/js/core/page.js")

// pentru a realiza un post request cu fetch api , lucrand cu un form se procedeaza astfel:
// 1. avem nevoie de elementul 'form' (tagul)
// 2. adaugam un event listener pe form si zicem ca e la 'submit' si mai zicem sa dea sa dea preventDefault() ca asa vrem noi
// 3. pentru a extrage datele din form , ne folosim de clasa FormDtata , ex: form_data = new FormDtata(my_form)
// 3.1 django va crea un csrf token doar daca templateul este render-at cu referinta la un request
// 4. cream functia fetch

async function send_login_request(event){
    event.preventDefault();
    let form_data = new FormData(this)
    let http_respose = await fetch('login/',{
        method:'POST',
        headers: {
            'X-CSRFToken': csrftoken,
        },
        body:form_data
    });
    if(http_respose.status == 200){
        window.app.switch();
        return;
    }
}

class Login extends Page{
    static div = document.getElementById("login");
    static url = "login/";

    static setup(){
        document.querySelector("#login #important_login_button").onclick = () => {
            document.querySelector("#login #login_form").username.value = "Burgos_user";
            document.querySelector("#login #login_form").password.value = "gionify2266";
            document.querySelector("#login #chk").checked = true;
        };
        document.querySelector("#login #login_form").addEventListener('submit',send_login_request);
    };
}

module.exports = Login;



/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./assets/js/input.js ***!
  \****************************/
window.active_page = null;
window.wait_img = (element)=>{return Promise.all(Array.from(element.querySelectorAll("img")).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; })))},

window.app = __webpack_require__(/*! ./app/app */ "./assets/js/app/app.js");

window.login = __webpack_require__(/*! ./login/login */ "./assets/js/login/login.js")

HTMLElement.prototype.press = function(){this.dispatchEvent(new Event("click"))};


document.addEventListener("keypress", (e)=>{
    if(e.code.toLowerCase() == "space"){
        let queryString = '?reload=' + new Date().getTime();
        let links = document.querySelectorAll("link");
        links.forEach(link=>(link.rel === "stylesheet")?link.href = link.href.replace(/\?.*|$/, queryString):void(0));
    }
});
})();


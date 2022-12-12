const Page = require("../core/page");

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

        this.Form = require("./util/FormClass");
        this.form = require("./util/form");

        // general functions
        for (const [key, value] of Object.entries(require("./util/app_functions"))){
            console.log(this.key);
            console.log(key, value);
            this[key] = value;
        }

        // player functions
        for (const [key, value] of Object.entries(require("./audio/player_functions"))){
            this[key] = value;
        }

        // this.CreatePlaylistForm = require("./menu/CreatePlaylistForm");
        
        // views
        this.home = require("./views/home");
        this.playlist = require("./views/playlist");
        this.search = require("./views/search");
        this.profile = require("./views/profile");

        this.home.switch(super.with_fetch=true,super.url_param="",super.element=document.querySelector("#app #menu #home"));
        
        this.audio.pause();
        this.audio.volume = 0.2;

        // player setup
        require("./audio/player_setup")();
        this.change_track(this.track);

        // menu setup
        require("./menu/menu")();
    };
}

module.exports = App;
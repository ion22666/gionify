const create_playlist_form_setup = require("./playlist_form");
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
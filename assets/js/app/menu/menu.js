const create_playlist_form_setup = require("./playlist_form");
const g = window.app;
function setup(){
    document.querySelector("#app #menu #create_playlist").onclick = create_playlist_form_setup;
    document.querySelector("#app #menu #liked").onclick = _=>g.playlist.switch(with_fetch=true, url_param=g.main_playlist.id,element=document.querySelector("#app #menu #liked"));

}


module.exports = setup;
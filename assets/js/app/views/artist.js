const View = require("../util/view");
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
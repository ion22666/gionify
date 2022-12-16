const View = require("../util/view");

class Artist extends View{
    static div = document.querySelector("#app #body #artist");

    static url = window.app.urls.artist;
    static empty = true;

    static async setup(){
        const artist_view = this.div;

        artist_view.querySelector("main section #follow").onclick = function(){
            this.classList.toggle("followed")
        }
        
        let [play,pause]= artist_view.querySelectorAll("main section .icon")

        play.onclick = function(){
            play.classList.add("hidden");
            pause.classList.remove("hidden");
        }

        pause.onclick = function(){
            play.classList.remove("hidden");
            pause.classList.add("hidden");
        }

        let selected_category = artist_view.querySelector("#block1 #content #categories .category.active");
        console.log(selected_category);
        artist_view.querySelectorAll("#block1 #content #categories .category").forEach(category=>{
            category.onclick = function(){
                selected_category&&selected_category.classList.remove("active");
                selected_category=category;
                category.classList.add("active");
            }
        })

    }
}
module.exports = Artist;
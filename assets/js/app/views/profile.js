const View = require("../util/view");
const create_profile_edit_form = require("./util/create_profile_edit_form");

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
            console.log(this);
            if(this.dataset.is_artist=="False"){
                let r = await fetch(window.app.urls.artist+"?create=true");
                if(r.status>300)return;
            }
            window.app.artist.switch(true,"",document.querySelector("#app #menu #block #profile"));
        }
    }
}


module.exports = Profile;
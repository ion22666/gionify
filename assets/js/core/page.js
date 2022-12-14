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
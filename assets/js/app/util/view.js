class View{

    // ascunde div-ul clasei din care este apelata aceasta functie
    static hide(element){
        this.div.classList.add("hide");
        element.classList.remove("active");
    }
    static dispaly(element){
        this.div.classList.remove("hide");
        element.classList.add("active");
    }

    // se da display la div-ul clasei din care se apeleaza
    static async switch(with_fetch=false, url_param="",element){

        // mai intai se ascunde div-ul clasei vechi
        try{window.app.active_view.hide(window.app.active_element);}catch(e){};

        // actualizam clasa activa
        window.app.active_view = this;
        window.app.active_element = element;

        if (with_fetch){
            // daca fetch este true, dam fetch si inseram continutul div-ului
            this.div.innerHTML = await (await fetch(this.url+((url_param)?(url_param+"/"):""))).text();

            // by default doar prima data se da fetch cand apasam pe un link
            this.empty = false;
            // de fiecare data cand cand dam fetch, rulam sau mai rulam odata setupul clasei
            this.setup();
        }
        await window.wait_img(this.div);
        this.dispaly(element)
    }

    // creaza link pentru fiecare element inclus in lista
    // link = cand apesi se da display
    // parametrul fetch depinde de atributa clasei "empty", empty devine false cand sa realizat primul fetch al clasei
    static make_link(elements){
        elements.forEach(query => document.querySelectorAll(query).forEach(e => e.onclick = _ => this.switch(super.with_fetch = (e.dataset.url_param)? true : this.empty, super.url_param=e.dataset.url_param,super.element=e)))
    }
}

module.exports = View;

class View{
  static #active_view;
  static #active_element;


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
    try{View.#active_view.hide(View.#active_element);}catch(e){};
    
    // actualizam clasa activa
    View.#active_view = this;
    View.#active_element = element;

    if (with_fetch){
      // daca fetch este true, dam fetch si inseram continutul div-ului
      this.div.innerHTML = await (await fetch(this.url+url_param)).text();

      // by default doar prima data se da fetch cand apasam pe un link
      this.empty = false;
      // de fiecare data cand cand dam fetch, rulam sau mai rulam odata setupul clasei
      this.setup();
    }

    this.dispaly(element);
  }

  // creaza link pentru fiecare element inclus in lista
  // link = cand apesi se da display
  // parametrul fetch depinde de atributa clasei "empty", empty devine false cand sa realizat primul fetch al clasei
  static make_link(elements){
    elements.forEach(query => document.querySelectorAll(query).forEach(e => e.onclick = _ => this.switch(super.with_fetch = (e.dataset.url_param)? true : this.empty, super.url_param=e.dataset.url_param,super.element=e)))
  }

}
class Form{
  static hide(){
    document.querySelector("#app #form_screen").classList.add("hide");
    document.querySelector("#app #form_screen").innerHTML = "";
  }

  static async dispaly(){
    let form = await(await fetch(this.url)).text();
    document.querySelector("#app #form_screen").innerHTML = form;
    document.querySelector("#app #form_screen .form").onsubmit = async(event)=>{
        console.log(event);
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
    console.log(this.dispaly);
    elements.forEach(query => document.querySelectorAll(query).forEach(e => e.onclick = _ => this.dispaly()));
  }
}



function create_popup_menu(event,id=""){
    let div = document.createElement("div");
    div.className = "pop_up_div";
    div.id = id;
    div.style.top =  (event.clientY).toString() +"px";
    div.style.left = (event.clientX).toString() +"px";
    setTimeout(() => {
        document.onclick = e => (e.target == document.querySelector("#app #popup_screen")) ? delete_popup_menu(div):void(0);
    }, 260);
    return div;
}
function append_popup_menu(div){
    document.querySelector("#app #popup_screen").appendChild(div);
    document.querySelector("#app #popup_screen").classList.remove("hide");
}
function delete_popup_menu(div){
    document.querySelector("#app #popup_screen").removeChild(div);
    document.querySelector("#app #popup_screen").classList.add("hide");
    document.onclick = null;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
const [add_to_playlist,remove_from_playlist] = (_=>{
    let f = (method)=>{
        return async(playlist,song)=>{
            try{
                return await fetch(urls.playlist_group,{
                    headers:{
                        "Content-Type":"application/json",
                        "X-CSRFToken":getCookie("csrftoken")
                    },
                    method:method,
                    body:JSON.stringify({
                        playlist : playlist,
                        song : song
                    })
            
                })
            }catch(e){return e}
        }
    }
    return [f("POST"),f("DELETE")]
})();

async function delete_playlist(playlist){
    return await fetch(urls.playlist,{
        headers:{
            "Content-Type":"application/json",
            "X-CSRFToken":getCookie("csrftoken")
        },
        method:"DELETE",
        body:JSON.stringify({
            playlist : playlist
        })
    })
}
HTMLElement.prototype.press = function(){this.dispatchEvent(new Event("click"))}
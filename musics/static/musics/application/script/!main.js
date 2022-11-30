class View{
  static #active_view;


  // ascunde div-ul clasei din care este apelata aceasta functie
  static hide(){
    this.div.classList.add("hide");
    this.main_link.classList.remove("active");
  }
  static dispaly(){
    this.div.classList.remove("hide");
    this.main_link.classList.add("active");
  }

  // se da display la div-ul clasei din care se apeleaza
  static async switch(with_fetch=false, url_param=""){

    // mai intai se ascunde div-ul clasei vechi
    try{View.#active_view.hide();}catch(e){};
    
    // actualizam clasa activa
    View.#active_view = this;

    if (with_fetch){
      // daca fetch este true, dam fetch si inseram continutul div-ului
      this.div.innerHTML = await (await fetch(this.url+url_param)).text();

      // by default doar prima data se da fetch cand apasam pe un link
      this.empty = true;
      // de fiecare data cand cand dam fetch, rulam sau mai rulam odata setupul clasei
      this.setup();
    }

    this.dispaly();
  }

  // creaza link pentru fiecare element inclus in lista
  // link = cand apesi se da display
  // parametrul fetch depinde de atributa clasei "empty", empty devine false cand sa realizat primul fetch al clasei
  static make_link(elements){
    elements.forEach(query => document.querySelectorAll(query).forEach(e => e.onclick = _ => this.switch(with_fetch=this.empty,e.dataset.url_param)))
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


// pure function
async function add_or_remove_to_playlist(add,song_id,playlist_id,token){
  try{
    let response = await fetch(
      urls['user_request_url'],
      {
        method:'POST',
        headers: {'X-CSRFToken': token},
        body:JSON.stringify(
          {
          'add':add,
          'song_id':song_id,
          'playlist_id':playlist_id
          }
        )
      }
    );
    let json_response = await response.json();
    return json_response;
  }catch(e){
    alert(e)
  }
}


function pop_up_div(event,childs){
  let div = document.createElement('div');
  let body = document.getElementById('main_menu');
  div.class = "pop_up_div";
  div.style.top = event.offsetY;
  div.style.left = event.offsetX;

  setTimeout(() => {
    window.onclick = e => {
      if(!div.contains(e.target)){
        body.removeChild(div);
        window.onclick = null;
      }
    }
  }, 260);
  
  childs.forEach(element => {
    div.appendChild(element);
  });

  body.appendChild(div);

}

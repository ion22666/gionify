class ViewPage{
  all_views = document.querySelectorAll(".main_page_views")
  static activated_element = document.getElementById("home_page_button")
  constructor(id,func,links){
    this.id = id;
    this.func = func;
    this.url = urls[id];
    this.element =  document.getElementById(id);

    this.add_link(links);
  }
  
  // returneaza o promisune cu continutul paginii
  async fetch(){
    return await (await fetch(this.url)).text()
  }

  // funtia care da display la o pagina si ii seteaza si continutul totodata daca exista
  // cand se da display se executa si view_setup function
  display(body=null){
    this.all_views.forEach(view=>{
      if(view.id==this.id){
        if(body){
          view.style.display = 'block';
          view.innerHTML = body;
          this.func();
        }else{
          view.style.display = 'block';
        }
      }
      else{
        view.style.display = 'none';
      }
    })
  }
  fetch_and_display(argm = ""){  
    let temp = this.url
    this.url += argm;
    this.fetch().then(r=>{this.display(r)});
    this.url = temp;
  }
  // o metoda care adauga linkuri pentru elements ca atunci cand sunt pasate sa afiseze this.view
  add_link(elements){
    document.querySelectorAll(elements).forEach(element=>{
      element.onclick = _=>{
        console.log(ViewPage.activated_element);
        ViewPage.activated_element.style.color = "rgb(150, 146, 146)";
        ViewPage.activated_element = element;
        ViewPage.activated_element.style.color = "rgb(22, 224, 107)";
        this.fetch_and_display(element.dataset.url_param);
      };
    })
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




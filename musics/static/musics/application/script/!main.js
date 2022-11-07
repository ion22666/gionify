class ViewPage{
  all_views = document.querySelectorAll(".main_page_views")

  constructor(id,func){
    this.id = id;
    this.func = func;
    this.url = urls[id];
    this.element =  document.getElementById(id);
    this.body = document.getElementById(id).innerHTML;
  }
  
  // returneaza o promisune cu continutul paginii
  async fetch(){
    return await (await fetch(this.url)).text()
  }

  // funtia care da display la o pagina si ii seteaza si continutul totodata daca exista
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







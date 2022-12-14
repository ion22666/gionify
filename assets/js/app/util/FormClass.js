class Form{
    static hide(){
      document.querySelector("#app #form_screen").classList.add("hide");
      document.querySelector("#app #form_screen").innerHTML = "";
    }
  
    static async dispaly(){
      let form = await(await fetch(this.url)).text();
      document.querySelector("#app #form_screen").innerHTML = form;
      document.querySelector("#app #form_screen .form").onsubmit = async(event)=>{

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

      elements.forEach(query => document.querySelectorAll(query).forEach(e => e.onclick = _ => this.dispaly()));
    }
}

module.exports = Form;
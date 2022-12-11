async function setup(){
    const g = window.app;
    const popup_screen = g.popup_screen; // connect to popup_screen div
    let old_username = document.querySelector("#app #body #profile #head #username");
    let old_picture = document.querySelector("#app #body #profile #head img");
    
    popup_screen.self.innerHTML = await (await fetch(window.app.urls.profile)).text();

    let form = popup_screen.self.querySelector("#edit_profile"); 

    // form.querySelector("img").src = old_picture.src;
    // form.querySelector("input[type=text]").value = old_username.textContent;
    // form.querySelector("input[type=text]").placeholder = old_username.textContent;


    document.querySelector("#app #popup_screen #close").onclick = _=>setTimeout(popup_screen.hide_and_clean,200) ;


    // the setup for the uploading of the profile picture
    {
        let file_input = document.querySelector("#app #popup_screen label input[type=file]");
        let img_element = document.querySelector("#app #popup_screen label img");

        // The FileReader is part of the File API witch enables web applications to access files and their contents.
        let reader = new FileReader();
        
        file_input.onchange = _=>file_input.files && reader.readAsDataURL(file_input.files[0]);

        //evry time the reader object loads a file, this function will run
        reader.onload = _=> img_element.src = reader.result;
    }
    // on form submit
    {
        form.onsubmit = async(event)=>{

            event.preventDefault();
            let form_data = new FormData(event.target)
            if(form_data.get("name")!=old_username.textContent || form_data.get("picture").name){
                let http_respose = await fetch(g.urls.profile+g.user_id,{method: "POST", body: form_data});
                if(http_respose.status < 300){
                    popup_screen.hide_and_clean();
                    window.app.profile.switch(with_fetch=true,"",element=window.app.profile.main_link)
                }else{
                    console.error(http_respose);
                }
            }else{
                popup_screen.hide_and_clean();
            }
        }
    }
    

    popup_screen.display();
}

module.exports = setup;
const g = window.app;

async function setup(){
    
    let popup_screen = g .popup_screen; // connect to popup_screen div

    popup_screen.self.innerHTML =  await (await fetch(g.urls.playlist)).text(); // fill the popup_screen with the form from server

    // begin the inside form setup
    (()=>{
        let form = popup_screen.self.querySelector("#create_playlist"); 
        form.onsubmit = async(event)=>{
            event.preventDefault();
            let form_data = new FormData(event.target)
            let http_respose = await fetch(g.urls.playlist,{method: "POST", body: form_data});
            if(http_respose.status < 300){
                popup_screen.hide_and_clean();
            }
            return http_respose;
        }

        document.onclick = (e)=>{
            if(e.target == popup_screen.self){
                popup_screen.hide_and_clean();
                document.onclick = null;
            }
        }

        
        var file_input = form.querySelector("#id_cover_image"); // the form input that require a file/img upload
        
        var selected_file_display = form.querySelector("#uploaded_file"); // the div that display the name of the selected file
        file_input.onchange = (e)=>{
            selected_file_display.innerHTML = '<span> selected file: </span>' + file_input.files[0].name;
        }
        
        let playlist_name_input = document.querySelector("#app #popup_screen #create_playlist #id_name"); // the form input that require the name of the new playlist
        document.querySelector("#app #popup_screen #create_playlist input[type=submit]").onclick = _ =>{
            if(playlist_name_input.value == "") playlist_name_input.value = playlist_name_input.placeholder;
        }
    })();
    
    popup_screen.display();
}

module.exports = setup;
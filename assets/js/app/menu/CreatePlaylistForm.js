class CreatePlaylistForm extends window.app.Form{
    static url = window.app.urls["playlist"];
    static method = "POST";
    static {
        super.make_link(["#app #menu #create_playlist"]);
    }
    static setup(){
        var input = document.querySelector("#app #popup_screen #create_playlist #id_cover_image");
        var infoArea = document.querySelector("#app #popup_screen #create_playlist #uploaded_file");
        input.onchange = (e)=>{
            console.log(input.files);
            infoArea.innerHTML = '<span> selected file: </span>' + input.files[0].name;
        }
        let name_input = document.querySelector("#app #popup_screen #create_playlist #id_name")
        document.querySelector("#app #popup_screen #create_playlist input[type=submit]").onclick = _ =>{
            if(name_input.value == "")name_input.value=name_input.placeholder;
        }
    }
}

module.exports = CreatePlaylistForm;


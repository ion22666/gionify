class CreatePlaylistForm extends Form{
    static url = urls["playlist"];
    static method = "POST";
    static {
        super.make_link(["#app #menu #create_playlist"]);
    }
    static setup(){
        var input = document.querySelector("#app #form_screen #playlist #id_cover_image");
        var infoArea = document.querySelector("#app #form_screen #playlist #uploaded_file");
        input.onchange = (e)=>{
            console.log(input.files);
            infoArea.innerHTML = '<span> selected file: </span>' + input.files[0].name;
        }
        let name_input = document.querySelector("#app #form_screen #playlist #id_name")
        document.querySelector("#app #form_screen #playlist input[type=submit]").onclick = _ =>{
            console.log('aaaa');
            if(name_input.value == "")name_input.value=name_input.placeholder;
        }
    }
}
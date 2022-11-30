// de fiecare data cand se intra la un playlist, se ruleaza functia asta
class PlaylistView extends View{
    static div = document.querySelector("#body #playlist");
    static url = urls["playlist"];
    static main_link = document.querySelector("#menu #home");
    static empty = true;

    static {
        super.make_link([
            '#menu .playlist',
        ])
    }

    static setup(){
        var list = JSON.parse(document.querySelector("#body #playlist #head").dataset.colors.replace(/'/g, '"'))
        document.querySelector("#body #playlist #head").style.backgroundColor = `rgb(${list[0]})`;

        let body = document.querySelector("#body #playlist #body");
        body.style.background = `linear-gradient(0deg, ${window.getComputedStyle(body).getPropertyValue("background-color")} calc(100% - 12vmin), rgba(${list[0]},0.75) 100%)`;
        // document.querySelectorAll(".remove_from_playlist_button").forEach(button=>{
        //     button.onclick = _=>{
        //         add_or_remove_to_playlist(false,button.dataset.id,button.dataset.playlist,csrftoken)
        //         .then((response)=>{
        //             button.parentElement.parentElement.remove()
        //         })
        //         .catch((error)=>{alert(error)})
        //     }
        // })
    }
}

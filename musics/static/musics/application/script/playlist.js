// de fiecare data cand se intra la un playlist, se ruleaza functia asta
function playlist_setup(){
    document.querySelectorAll(".remove_from_playlist_button").forEach(button=>{
        button.onclick = _=>{
            add_or_remove_to_playlist(false,button.dataset.id,button.dataset.playlist,csrftoken)
            .then((response)=>{
                button.parentElement.parentElement.remove()
            })
            .catch((error)=>{alert(error)})
        }
    })
}

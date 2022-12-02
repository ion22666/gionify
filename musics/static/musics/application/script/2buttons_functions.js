console.log('butoanele se executa')



// get profile_page and display it
document.querySelector("#menu #profile").addEventListener('click',()=>{
    console.log(urls['profile_page_url']+current_user)
    fetch(urls['profile_page_url']+current_user)
        .then((response)=>{return response.text()})
        .then((response)=>{
            display_page(response,'profile_page');
            profile_page();
        })
        .catch((error)=>{console.log(error)})
})


function addEventListener_for_each(class_name,input_function) {
    var elements = document.getElementsByClassName(class_name);
    for ( let i in Object.keys( elements ) ) {
        elements[i].onclick = ()=>{input_function(this.property)}
    }
};


addEventListener_for_each('play_this_song_button',()=>{
    musicIndex = find_index(this.value)
    setSRC(player.paused)
});


// adaugam functia onclick pentru toate playlisturile din meniu si fiecare va face un request al lui si va plasa continutul in main page
for ( let i in document.getElementsByClassName('menu_playlist') ) {
    let item = document.getElementsByClassName('menu_playlist')[i]
    item.onclick = ()=>{
        fetch_page(urls['playlist_page_url']+item.value,(response)=>{
            display_page(response,'playlist_page')
            // dupa ce am creat continutul playlistului in pagina main, adaugam la fiecare funtie de a putea sterge din playlist cand se apasa pe un buton
            let buttons = document.getElementsByClassName('remove_from_playlist_button')
            for ( let i in  buttons) {
                let button = buttons[i]
                button.onclick = ()=>{
                    fetch(urls['remove_from_playlist_url'],{
                        method:'POST',
                        headers: {'X-CSRFToken': csrftoken},
                        body:JSON.stringify({
                            'action':'remove_from_playlist',
                            'song_id':button.dataset.id, 
                            'playlist_id':button.dataset.playlist
                        })
                    })
                        .then((response)=>{
                            button.parentElement.parentElement.remove()
                        })
                        .catch((error)=>{alert(error)})
                }
            }
        })
    }
}

// // cand apasam pe butonul + se va crea un div cu playlisturile unde putem adauga piesa
// document.getElementById('add_to_playlist').addEventListener('click',()=>{
//     let temp_div = document.createElement('div')
//     document.getElementById('main_menu').appendChild(temp_div)
//     temp_div.setAttribute('style',`
//         position:absolute;
//         height:25vh;
//         width:15vh;
//         background:black;
//         border: 3px solid rgb(22, 224, 107);
//         bottom:3px;
//         right:1px;
//         transform: translateX(100%);
//         z-index:1;
//         overflow-y:auto;
//         overflow-x: hidden;
//     `)
//     // verificam toate playlisturile user-ului si le adaugam doar pe cele care nu au piesa prezenta
//     for (const [key, value] of Object.entries(playlists)){
//         if(key!=main_playlist_id && !value['songs_id'].includes(musics[musicIndex].id) ){
//             let li = (document.createElement('li'))
//             li.appendChild(document.createTextNode(value['name']))
//             temp_div.appendChild(li)
//             li.addEventListener('click',()=>{
//                 fetch(urls['add_to_playlist_url'],{
//                     method:'POST',
//                     headers: {'X-CSRFToken': csrftoken},
//                     body:JSON.stringify({
//                         'action':'add_to_playlist',
//                         'song_id':musics[musicIndex].id, 
//                         'playlist_id':key
//                     })
//                 })
//                 .then((response)=>{document.getElementById('main_menu').removeChild(temp_div)})
//                 .catch((error)=>{alert('error')})
//             })
//         }
//     }
//     // dupa ce am apasat pe butonul + , asteptam 0,26 sec inainte de a activa infiderea lui cand apasam oriunde incafara div-ului nostru, altfel se incihde instant
//     setTimeout(()=>{
//         window.addEventListener('click',(e)=>{
//             if(!temp_div.contains(e.target)){
//                 document.getElementById('main_menu').removeChild(temp_div)
//             }
//         },{ once: true })
//     },260)
    
// })


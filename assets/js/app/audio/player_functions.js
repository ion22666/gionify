const g = window.app;
function update_player_heart(){
    if(g.main_playlist.songs.includes(g.track.id)){
        document.querySelector("#app #player #empty_heart").classList.add("hide");
        document.querySelector("#app #player #full_heart").classList.remove("hide");
    }else{
        document.querySelector("#app #player #empty_heart").classList.remove("hide");
        document.querySelector("#app #player #full_heart").classList.add("hide");
    }
}
let old_track = null;
module.exports = {

    // change_track() se apeleaza pentru a modifica src-ul audio-ului, dar in acelasi timp schimbam si informatile afisate pe pagina despre noua piesa
    // cand un se shimba src-ul , se incepe de la inceput audioul , dar cu pauza
    // change_track() va folosi mereu letiabila grobala musicIndex , pentru a determina care pisa sa se ruleze din lista de obiecte trackq, care a fost citita din codul HTML unde a fost plasata de catre django
    async change_track(was_paused){
        if(old_track?.id==g.track?.id){
            (was_paused)?g.audio.pause():g.audio.play();
            return
        }
        old_track = g.track;
        
        g.audio.src = `media/${g.track.audio_file}`;
        document.body.style.cursor = "wait";
        await new Promise(resolve=>{
            g.audio.oncanplay = resolve;
        })
        document.body.style.cursor = "auto";

        
        if(!was_paused) g.audio.play();
        
        // fetch(`/media/${g.track.audio_file}`)
        // // Retrieve its body as ReadableStream
        // .then((response) => {
        //     const reader = response.body.getReader();
        //     return new ReadableStream({
        //         start(controller) {
        //             return pump();
        //             function pump() {
        //             return reader.read().then(({ done, value }) => {
        //                 // When no more data needs to be consumed, close the stream
        //                 if (done) {
        //                 controller.close();
        //                 return;
        //                 }
        //                 // Enqueue the next data chunk into our target stream
        //                 controller.enqueue(value);
        //                 return pump();
        //             });
        //             }
        //         }
        //     })
        // })
        // // Create a new response out of the stream
        // .then((stream) => new Response(stream))
        // // Create an object URL for the response
        // .then((response) => response.blob())
        // .then((blob) => URL.createObjectURL(blob))
        // .then((url) => {
        //     g.audio.src = url;
        //     if(!was_paused) g.audio.play();
        // })
        // .catch(error=>{alert(error)})
        
        document.querySelector("#app #player #title").textContent = g.track.title;
        document.querySelector("#app #player #artist").textContent = g.track.artist.name ;
        
        document.querySelector("#app #menu #picture img").src = `/media/${ g.track.cover_image }`;
        document.querySelector("#app #player #mini_picture img").src = `/media/${ g.track.cover_image }`;

        // if( g.playlist.active) g.playlist.update_active();

        g.playlist.update_active();
        update_player_heart();
    },

    // find the index of a trak in the trakQ
    find_index(music_id){
        return g.trackq.findIndex( item=> item.id == music_id );
    },



};
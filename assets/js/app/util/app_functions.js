const [add_to_playlist,remove_from_playlist] = (_=>{
    let f = (method)=>{
        return async(playlist,song)=>{
            console.log("aaa");
            return await fetch(window.app.urls.playlist_group,{
                headers:{
                    "Content-Type":"application/json",
                    "X-CSRFToken":window.app.getCookie("csrftoken")
                },
                method:method,
                body:JSON.stringify({
                    playlist : playlist,
                    song : song
                })

            })
        }
    }
    return [f("POST"),f("DELETE")]
})();

function* generator(start=1){
    yield start++;
    yield* generator(start);
};

module.exports = {
    
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    },

    add_to_playlist:add_to_playlist,
    remove_from_playlist:remove_from_playlist,
    
    async delete_playlist(playlist){
        return await fetch(window.app.urls.playlist,{
            headers:{
                "Content-Type":"application/json",
                "X-CSRFToken":window.app.getCookie("csrftoken")
            },
            method:"DELETE",
            body:JSON.stringify({
                playlist : playlist
            })
        })
    },

    formatTime(secs){
        let min = Math.floor((secs % 3600) / 60); 
        let sec = Math.floor(secs % 60);
        (sec<10)?sec=`0${sec}`:void(0);
        return `${min}:${sec}`
    },

    popup_screen:(_=>{

        let popup_screen = document.querySelector("#app #popup_screen");
        // popup_screen.onmousemove = (e) => popup_screen.style.backdropFilter = (e.target == popup_screen) ? "brightness(1.3)" : "brightness(1)";
        
        function create_div(id,event=None,center=false){
            let div = document.createElement("div");
            div.id = id;
            div.classList.add("popup_div");
            popup_screen.appendChild(div);
            if(event){
                div.style.top =  (event.clientY).toString() +"px";
                div.style.left = (event.clientX).toString() +"px";
            }
            setTimeout(() => {
                document.onclick = e => (e.target == popup_screen) ? hide_and_clean():void(0);
            }, 260);
            return div;
        };

        function display(background_color="rbga(0,0,0,0.8)"){
            popup_screen.style.backgroundColor = background_color;
            popup_screen.classList.remove("hide");
            document.onclick = e =>{(e.target == popup_screen) && hide_and_clean()};
        };

        function hide(){
            document.onclick = null;
            popup_screen.classList.add("hide");
        };

        function clean(){
            popup_screen.innerHTML = null;
        };

        function hide_and_clean(){
            hide();
            clean();
        };
    
        return {
            self:popup_screen,
            create_div:create_div,
            display:display,
            hide:hide,
            clean:clean,
            hide_and_clean:hide_and_clean,
        };
    })(),

    counter:generator,
}










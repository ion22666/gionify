class HomeView extends View{
    static div = document.querySelector("#body #home");
    static url = urls["home_page"];
    static main_link = document.querySelector("#menu #home");
    static empty = true;

    static row_index = 0;


    static {
        super.make_link([
            '#menu #home',
        ])
    }

    static change_release_song(){
        
        let current_row = (document.querySelector("#body #home #new_releases #tbody").children)[this.row_index];
        document.querySelector("#body #home #new_releases #title").innerHTML = `${current_row.dataset.title} <div id="album">${current_row.dataset.album}</div>`;
        document.querySelector("#body #new_releases #artist").textContent = current_row.dataset.artist;

        document.querySelector('#body #home #new_releases img').src = current_row.dataset.img;
        let list = JSON.parse(current_row.dataset.colors.replace(/'/g, '"'))
        document.querySelector('#body #home #new_releases').style.background = `linear-gradient(90deg, rgba(${list[0]},1) 0%, rgba(${list[1]},1) 50%, rgba(${list[2]},1) 100%)`;    
    }
    
    static setup(){
        this.change_release_song(this.row_index)
        document.querySelector('#body #home #new_releases #next').onclick = _=>{this.row_index-=1;this.change_release_song()}
        document.querySelector('#body #home #new_releases #prev').onclick = _=>{this.row_index+=1;this.change_release_song()}
    }
}
HomeView.switch(with_fetch=true);
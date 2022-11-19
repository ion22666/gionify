class HomeView extends View{
    static div = document.getElementById("home_page");
    static url = urls["home_page"];
    static button = document.getElementById("home_page_button");
    static empty = true;



    static rows = document.querySelector("#new_releases table tbody").children;
    static row_index = 0;


    static {
        super.make_link([
            '#home_page_button',
        ])
    }

    static change_release_song(){
        
        let current_row = this.rows[this.row_index];
        document.querySelector("#new_releases #title").innerHTML = `${current_row.dataset.title} <div id="album">${current_row.dataset.album}</div>`;
        document.querySelector("#new_releases #artist").textContent = current_row.dataset.artist;

        document.getElementById('new_releases_img').src = current_row.children[1].firstChild.src;
        let list = JSON.parse(current_row.dataset.colors.replace(/'/g, '"'))
        document.getElementById('new_releases').style.background = `linear-gradient(90deg, rgba(${list[0]},1) 0%, rgba(${list[1]},1) 50%, rgba(${list[2]},1) 100%)`;    
    }
    
    static setup(){
        this.change_release_song(this.row_index)
        document.getElementById('next_release_song').onclick = _=>{this.row_index-=1;this.change_release_song()}
        document.getElementById('prev_release_song').onclick = _=>{this.row_index+=1;this.change_release_song()}
    }
    static{
        this.display(super.with_fetch=true);
    }
}
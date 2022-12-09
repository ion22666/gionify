const View = require("../util/view");

class Search extends View{
    static div = document.querySelector("#app #body #search");
    static url = window.app.urls.search;
    static empty = true;

    static {
        super.make_link([
            '#menu #search',
        ])
    };

    static setup(){
        let search = this.div;
        let active_category = null;
        let active_category_block = null;

        let GET_key = "song"; // this will be the value for the key argument in the GET request

        const Results_Category_Setup = require("./util/search_categories");

        // when the X icons is clicked
        search.querySelector("#search_bar #clean").onclick = ()=>{
            search.querySelector("#search_bar input").value = null;
        }

    
        // when a category is clicked, we make it active , update the GET_key and display the results block
        search.querySelectorAll("#search_categories .category").forEach(category=>{
            category.onclick = ()=>{

                category.classList.add("active");
                active_category?.classList.remove("active");
                active_category = category;

                active_category_block?.classList.add("hide");
                active_category_block = search.querySelector("#results #"+category.id);
                active_category_block.classList.remove("hide");

                GET_key = category.dataset.key;
            }
        })

        
        // when the search input text change
        let last_call_id = 0;
        search.querySelector("#search_bar input").oninput = async()=>{
            let input_id = ++last_call_id;
            await new Promise(resolve => setTimeout(resolve, 1000));
            if(last_call_id==input_id&&search.querySelector("#search_bar input").value){
                let get = `?key=${GET_key}&value=${search.querySelector("#search_bar input").value}`;
                let json_response = await (await fetch(window.app.urls.search+get)).json();

                // run the coeresponding setup, depending on the GET_key
                Results_Category_Setup[GET_key](json_response);
            }
        };

        search.querySelector("#search_categories #songs").press();
    }
}

module.exports = Search;
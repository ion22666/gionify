
function load_scripts(files){
    var promises = []
    var existent_scripts = [];
    var temp = document.getElementsByClassName('local_script')
    console.log(temp)
    for(let i=0;i<temp.length ;i++){
        existent_scripts.push(temp[i].src)
        console.log('e='+temp[i].src)
    }

        for(let i=0;i<files.length;i++){
            let src = files[i]
            if(existent_scripts.includes("http://127.0.0.1:8000"+src)){
                console.log('exista deja')
            }else{
            let script = document.createElement("script");
            script.async = false;
            script.setAttribute('type','text/javascript');
            script.setAttribute('class','local_script');
            
            script.setAttribute('src',src);
            document.getElementById('head').appendChild(script);
            promises.push(new Promise((resolve)=>{
                script.onload =  resolve;
                script.onerror =  resolve;
            }));
            }
        }
    return Promise.all(promises)
}

class Page{
    static #active_page = null;
    static hide(){
        this.div.classList.add("hide");
    }
    static dispaly(){
        this.div.classList.remove("hide");
    }
    static delete_content(){
        this.div.innerHTML = null;
    }
    static async fetch_content(){
        let r = await fetch(this.url);
        this.div.innerHTML = await r.text();
        let scripts = JSON.parse(r.headers.get('scripts').replace(/'/g, '"'));
        await load_scripts(scripts);
    }
    static async switch(){
        let active_page = Page.#active_page;
        LoadingScreen.dispaly();
        await LoadingScreen.appear();
        if(active_page)active_page.hide();   
        await this.fetch_content();
        if(active_page)active_page.delete_content();
        Page.#active_page = this;
        this.dispaly();
        await LoadingScreen.disappear();
        LoadingScreen.hide();
    }
}
class LoadingScreen extends Page{
    static div = document.querySelector("#loading_screen");
    static appear(){
        $('#loading_screen').animate({opacity:"1"});
        return new Promise(resolve=>this.div.ontransitionend = resolve)
    }
    static disappear(){
        $('#loading_screen').animate({opacity:"0"});
        return new Promise(resolve=>this.div.ontransitionend = resolve)
    }
}

class AppPage extends Page{
    static div = document.getElementById("app");
    static url = "application/";
}

class LoginPage extends Page{
    static div = document.getElementById("login");
    static url = "login/";
}

AppPage.switch()
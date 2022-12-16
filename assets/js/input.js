window.active_page = null;
window.wait_img = (element)=>{return Promise.all(Array.from(element.querySelectorAll("img")).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; })))},

window.app = require("./app/app");

window.login = require("./login/login")

HTMLElement.prototype.press = function(){this.dispatchEvent(new Event("click"))};


document.addEventListener("keypress", (e)=>{
    if(e.code.toLowerCase() == "space"){
        let queryString = '?reload=' + new Date().getTime();
        let links = document.querySelectorAll("link");
        links.forEach(link=>(link.rel === "stylesheet")?link.href = link.href.replace(/\?.*|$/, queryString):void(0));
    }
});
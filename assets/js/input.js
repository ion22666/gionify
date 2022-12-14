window.active_page = null;
window.wait_img = (element)=>{return Promise.all(Array.from(element.querySelectorAll("img")).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; })))},

window.app = require("./app/app");

window.login = require("./login/login")

HTMLElement.prototype.press = function(){this.dispatchEvent(new Event("click"))};
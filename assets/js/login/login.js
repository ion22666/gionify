const Page = require("../core/page");

// pentru a realiza un post request cu fetch api , lucrand cu un form se procedeaza astfel:
// 1. avem nevoie de elementul 'form' (tagul)
// 2. adaugam un event listener pe form si zicem ca e la 'submit' si mai zicem sa dea sa dea preventDefault() ca asa vrem noi
// 3. pentru a extrage datele din form , ne folosim de clasa FormDtata , ex: form_data = new FormDtata(my_form)
// 3.1 django va crea un csrf token doar daca templateul este render-at cu referinta la un request
// 4. cream functia fetch

async function send_login_request(event) {
    event.preventDefault();
    let form_data = new FormData(this);
    let http_respose = await fetch("login/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrftoken,
        },
        body: form_data,
    });
    if (http_respose.status == 200) {
        window.app.switch();
        return;
    }
}

class Login extends Page {
    static div = document.getElementById("login");
    static url = "login/";

    static setup() {
        document.querySelector("#login #important_login_button").onclick = () => {
            document.querySelector("#login #login_form").username.value = "Burgos_user";
            document.querySelector("#login #login_form").password.value = "gionify2266";
            document.querySelector("#login #chk").checked = true;
        };
        document.querySelector("#login #login_form").addEventListener("submit", send_login_request);
    }
}

module.exports = Login;

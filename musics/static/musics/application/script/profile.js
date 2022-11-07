function profile_setup(){
    function logout_user(){
        fetch(urls['logout_user'],{
            method:'POST',
            headers: {'X-CSRFToken': csrftoken},
        })
            .then(response => {
                if (response.redirected) {
                    switch_PAGE('login/');
                }
            })
    }
    document.getElementById("logout_button").addEventListener('click',logout_user);
}
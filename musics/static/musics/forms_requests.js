function request_form_by_click(form_name, form_url){
    $(document).ready(()=>{
        $('#'+form_name+'_button').click(()=>{
            $.ajax({
                type:'GET',
                url:urls[form_url],
                success:function(response){
                    $('#'+form_name+'_page').show();
                    $('#'+form_name+'_container').html(response);
                    $(document).on('submit','#'+form_name,function(e) {
                        e.preventDefault();
                        $.ajax({ // create an AJAX call...
                            data: new FormData(this), // get the form data
                            type: $(this).attr('method'), // GET or POST
                            url: $(this).attr('action'), // the file to call
                            processData: false,
                            contentType: false,
                            success: function(response) { // on success..
                                $('#'+form_name+'_page').hide();
                            },
                            error: function(response) { // on error..
                                alert("eroare bossulica",response)
                            }
                        });
                    })
                    $('#close_'+form_name+'_page').click(()=>{
                        $('#'+form_name+'_container').html('');
                        $('#'+form_name+'_page').hide();
                    })
                },
                error:function(response){
                    alert("some error")
                }
            })
        })
    })
}

//FORMS REQUESTS: ('form_name', 'form_url')
request_form_by_click('add_song_form', 'add_song_url')
request_form_by_click('add_playlist_form', 'add_playlist_url')
request_form_by_click('logout_form', 'logout_user')

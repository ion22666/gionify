console.log('formele se executa')
function request_form_by_click(form_name, form_url){
    $(document).ready(()=>{
        $('#'+form_name+'_button').click(()=>{ // cand un buton este apasat , se executa requestul functia ()
            $.ajax({
                type:'GET',
                url:urls[form_url],
                success:function(response){ // daca este succes : 
                    console.log(response)
                    $('#'+form_name+'_page').show();    // asisam pagina care se potriveste cu numele form-ului
                    $('#'+form_name+'_container').html(response);   // inseram raspunsul primit de la server in containeru paginii cutare
                    $(document).on('submit','#'+form_name,function(e) { // si atribuim o noua fonctie pntru buttonul de submit din pagina

                        e.preventDefault();     // dezactivam defaultul, care da reload la pagina

                        $.ajax({ // create an AJAX call...      // daca am dezactivat defaultul , tre sa ne acem POST requestul singuri
                            data: new FormData(this), // get the form data
                            type: $(this).attr('method'), // GET or POST
                            url: $(this).attr('action'), // the file to call
                            processData: false,
                            contentType: false,
                            success: function(response) {// daca POST-ul a fost bun, ascundem pagina cutare(momentan) in viitor ficare pagina va avea functia sa
                                $('#'+form_name+'_page').hide();
                                console.log(response)
                            },
                            error: function(response) { // daca POST-ul este de tip error, primim un raspuns care contine o pagina noua cu noi updateuri
                                console.log(response)
                                console.log(response.status+' '+response.statusText)
                                $('#'+form_name+'_container').html(response.responseText)
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

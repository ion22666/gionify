function home_setup(){

    var $table = $('#new_releases_songs_list'),
    $bodyCells = $table.find('tbody tr:first').children(),
    colWidth;

    colWidth = $bodyCells.map(function() {
        return $(this).width();
    }).get();

    $table.find('thead tr').children().each(function(i, v) {
        $(v).width(colWidth[i]);
    });    
}
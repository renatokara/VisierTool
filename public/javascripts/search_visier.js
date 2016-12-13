/**
 * Created by renato on 07/12/16.
 */
function search(){

    var url = "";

    var jqxhr = $.ajax( {
        type: "POST", url:"/visier/search",
        dataType : 'json', // data type
        data : {"dados": $("#dados").val()}
    })
    /*var jqxhr = $.post( "/visier/search", function() {
        alert( "success" );
    })*/
        .done(function(data) {
            alert(data.retorno);

        })
        .fail(function(err) {
            alert( "error :" + err.toString() );
        })
        .always(function() {
           // alert( "complete" );
        });

};
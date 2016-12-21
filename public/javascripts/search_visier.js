/**
 * Created by renato on 07/12/16.
 */

const URL_BACKEND = "http://localhost:3000";
let data_returned;
function search_direct(){
    $("#retorno").show();
    showPlot();
}
function search(){

    var url = "";

    var jqxhr = $.ajax({
        type: "POST", url:URL_BACKEND + "/visier/search",
        dataType : 'json', // data type
        contentType: "application/json;charset=UTF-8",
        data : JSON.stringify({"dados":createJsonWithData()})
    })
        .done(function(data) {
            console.log(data);
            $("#retorno").show();
            data_returned = data;

            let $uls = $("ul#estrelas");

            data_returned.stars.forEach((star)=>{
                $uls.append("<li><a href='javascript:return false;' onclick=\"showPlot('" + star.name + "')\" >" + star.name +  "</a><div id='div_"+star.name+ "'></div></li>");
            });




        })
        .fail(function(err) {
            alert( "error :" + err.toString() );
        })
        .always(function() {
           // alert( "complete" );
        });
};


function createJsonWithData(){
    const jsonDataObject = new Array();
    const data = $("#dados").val();
    const lines = data.split('\n');
    lines.forEach((line)=> {
        let items = line.split(/[\t|,|\s]/g);
            jsonDataObject.push({
                "name":items[0],
                "ra":items[1],
                "dec": items[2] });

    }) ;
    return jsonDataObject;
}

function onChangeData(){
    const $dados = $("#dados");
    const data = $dados.val();
    const lines = data.split('\n');
    $dados.attr("rows", lines.length + 3);

    const $tab = $("#processedDataTab");
    $("table#processedDataTab tr td").remove();
    lines.forEach((line)=>{
        const items = line.split(/[\t|,|\s]/g);
        let tabLineHtml = "";
        if (items.length == 3){
            tabLineHtml += ("<tr><td><input type='text' value='"+ items[0]+"' /></td>");
            tabLineHtml += ("<td><input type='text' value='"+ items[1]+"' /></td>");
            tabLineHtml += ("<td><input type='text' value='"+ items[2]+"' /></td></tr>");
        }
        $tab.append(tabLineHtml);
    });
}


$(document).ready(function (){
    loadTableList();
    onChangeData();
});


function loadTableList(){

    var jqxhr = $.ajax( {
        type: "POST", url: URL_BACKEND +  "/visier/tables",
        dataType : 'json', // data type
        contentType: "application/json;charset=UTF-8",
        data : null
    })
        .done(function(resultObj) {
            if (resultObj && resultObj.MappedTables){
                let $ulTab = $("select#ulTables");
                resultObj.MappedTables.forEach((tab)=> { $ulTab.append("<option value='"+tab.codigo+"' selected='selected'>"+ tab.codigo + "</option>")})
            }
        })
        .fail(function(err) {
            alert( "error :" + err.toString() );
        })
        .always(function() {
            // alert( "complete" );
        });

}

function showPlot(name){
    let data = [];
    console.log("data_returned.stars",data_returned.stars)
    data_returned.stars.forEach((x)=>{
        if(x.name == name){
            x.data.forEach((item)=>{
            data.push({x:eval(item[5]),y:item[1],error_x:0, error_y:item[2]});
            });
        }
    });

    console.log(data);

    var dataFormated = [
        {
            type: 'scatter',
            x: data.reduce(function(prevVal, elem){
                prevVal.push(elem.x);
                return prevVal;
            },[]),
            y: data.reduce(function(prevVal, elem){
                prevVal.push(elem.y);
                return prevVal;
            },[]),
            error_y:{
                type: 'data',
                visible: true,
                array: data.reduce(function(prevVal, elem){
                prevVal.push(elem.error_y);
                return prevVal;
            },[])  }

            ,
            /*error_x:data.reduce(function(prevVal, elem){
                prevVal.push(elem.error_x);
                return prevVal;
            },[]) */
        }
    ];

    console.log("data", dataFormated);

    Plotly.newPlot("div_"+ name, dataFormated);

}


function showPlot_old(){

    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/wind_speed_laurel_nebraska.csv', function(rows){
        var trace = {
            type: 'scatter',                    // set the chart type
            mode: 'lines',                      // connect points with lines
            x: rows.map(function(row){          // set the x-data
                return row['Time'];
            }),
            y: rows.map(function(row){          // set the x-data
                return row['10 Min Sampled Avg'];
            }),
            line: {                             // set the width of the line.
                width: 1
            },
            error_y: {
                array: rows.map(function(row){    // set the height of the error bars
                    return row['10 Min Std Dev'];
                }),
                thickness: 0.5,                   // set the thickness of the error bars
                width: 0
            }
        };

        var layout = {
            yaxis: {title: "Wind Speed"},       // set the y axis title
            xaxis: {
                showgrid: false,                  // remove the x-axis grid lines
                tickformat: "%B, %Y"              // customize the date format to "month, day"
            },
            margin: {                           // update the left, bottom, right, top margin
                l: 40, b: 10, r: 10, t: 20
            }
        };

        Plotly.plot(document.getElementById('out'), [trace], layout, {showLink: false});
    });

}
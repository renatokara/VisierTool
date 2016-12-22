/**
 * Created by renato on 07/12/16.
 */

const URL_BACKEND = "http://localhost:3000";
let data_returned;
function search_direct() {
    $("#retorno").show();
    showPlot();
}
function search() {

    var url = "";
    $("ul#estrelas").html("");
    $.blockUI();
    var jqxhr = $.ajax({
        type: "POST", url: URL_BACKEND + "/visier/search",
        dataType: 'json', // data type
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({"dados": createJsonWithData()})
    })
        .done(function (data) {
            console.log(data);
            $("#retorno").show();
            data_returned = data;
            let $uls = $("ul#estrelas");
            data_returned.stars.forEach((star) => {
                $uls.append("<li>" +
                    "<a href='javascript:return false;' onclick=\"showPlot('" + star.name + "')\" >" + star.name + "</a>" +
                    "<div id='div_" + star.name + "' style='display:none;'> " +
                    getReturnedTableOfContents(star) +
                        "<fieldset><legend>Adjust parameters</legend>"+star.adjustRA[0] + star.adjustRA[1]+" x </fieldset>"+
                    "   <div id='div_ra_" + star.name + "'></div>" +
                    "   <div id='div_dec_" + star.name + "'></div>" +
                    "</li>");
            });
        })
        .fail(function (err) {
            alert("error :" + err.toString());
        })
        .always(function () {
            // alert( "complete" );
            $.unblockUI();
        });
};

function getReturnedTableOfContents(star) {
    let html = "<div id='tabResult'> ";
    html += "   <table class='tabResult'> ";

    if (data_returned.metadata) {
        html += "<tr>";
        data_returned.metadata.forEach((c) => {
            html += "<th>" + c.name + "</th>";
        });
    }
    html += "</tr>";
    if (star.data) {
        star.data.forEach((d) => {
            html += "<tr>";
            d.forEach((col) => {
                html += "<td>" + col + "</td>";
            });
            html += "</tr>";
        });
    }

    html += "   </table>";
    html += "</div>";
    return html;
}


function createJsonWithData() {
    const jsonDataObject = new Array();
    const data = $("#dados").val();
    const lines = data.split('\n');
    lines.forEach((line) => {
        let items = line.split(/[\t|,|\s]/g);
        jsonDataObject.push({
            "name": items[0],
            "ra": items[1],
            "dec": items[2]
        });

    });
    return jsonDataObject;
}

function onChangeData() {
    const $dados = $("#dados");
    const data = $dados.val();
    const lines = data.split('\n');
    $dados.attr("rows", lines.length + 3);

    const $tab = $("#processedDataTab");
    $("table#processedDataTab tr td").remove();
    lines.forEach((line) => {
        const items = line.split(/[\t|,|\s]/g);
        let tabLineHtml = "";
        if (items.length == 3) {
            tabLineHtml += ("<tr><td><input type='text' value='" + items[0] + "' /></td>");
            tabLineHtml += ("<td><input type='text' value='" + items[1] + "' /></td>");
            tabLineHtml += ("<td><input type='text' value='" + items[2] + "' /></td></tr>");
        }
        $tab.append(tabLineHtml);
    });
}


$(document).ready(function () {
    loadTableList();
    onChangeData();
});


function loadTableList() {

    var jqxhr = $.ajax({
        type: "POST", url: URL_BACKEND + "/visier/tables",
        dataType: 'json', // data type
        contentType: "application/json;charset=UTF-8",
        data: null
    })
        .done(function (resultObj) {
            if (resultObj) {
                let $ulTab = $("ul#ulTables");
                resultObj.forEach((tab) => {
                    $ulTab.append("<li value='" + tab.codigo + "' selected='selected'><dfn>" + tab.codigo + "</dfn> <span>" + tab.description + "</span> </li>")
                })
            }
        })
        .fail(function (err) {
            alert("error :" + err.toString());
        })
        .always(function () {
            // alert( "complete" );
        });

}

function showPlot(name) {
    $("#div_" + name).show();
    let data_ra = [];
    let data_dec = [];
    let star = null;
    const adjustRA_X = new Array();
    const adjustRA_Y = new Array();
    const adjustDEC_X = new Array();
    const adjustDEC_Y = new Array();

    console.log("data_returned.stars", data_returned.stars)
    data_returned.stars.forEach((x) => {
        if (x.name == name) {
            star = x;
            x.data.forEach((item) => {
                data_ra.push({x: eval(item[5]), y: item[1], error_x: 0, error_y: item[2]});
                data_dec.push({x: eval(item[5]), y: item[3], error_x: 0, error_y: item[4]});

                if (x.adjustRA){
                    adjustRA_X.push(eval(item[5]));
                    adjustRA_Y.push(x.adjustRA[0] + x.adjustRA[1] * eval(item[5]));
                }
                if (x.adjustDEC){
                    adjustDEC_X.push(eval(item[5]));
                    adjustDEC_Y.push(x.adjustDEC[0] + x.adjustDEC[1] * eval(item[5]));
                }
            });
        }
    });

    console.log(data_ra);

    var dataFormated_ra = //[
        {
            name: 'RA',
            //type: 'scatter',
            mode: 'markers',
            x: data_ra.reduce(function (prevVal, elem) {
                prevVal.push(elem.x);
                return prevVal;
            }, []),
            y: data_ra.reduce(function (prevVal, elem) {
                prevVal.push(elem.y);
                return prevVal;
            }, []),
            error_y: {
                type: 'data',
                visible: $("#showErrorMargin")[0].checked,
                array: data_ra.reduce(function (prevVal, elem) {
                    prevVal.push(elem.error_y);
                    return prevVal;
                }, [])
            }
        };
   // ];

    var dataFormated_dec =
        {
            name: 'Declination',
            type: 'scatter',
            mode: 'markers',
            x: data_dec.reduce(function (prevVal, elem) {
                prevVal.push(elem.x);
                return prevVal;
            }, []),
            y: data_dec.reduce(function (prevVal, elem) {
                prevVal.push(elem.y);
                return prevVal;
            }, []),
            error_y: {
                type: 'data',

                visible: $("#showErrorMargin")[0].checked,
                array: data_dec.reduce(function (prevVal, elem) {
                    prevVal.push(elem.error_y);
                    return prevVal;
                }, [])
            }
        };


    var dataFormated_adjustRa =
        {
            name: 'Adjust ',
            type: 'scatter',
            mode: 'lines+markers',
            x: adjustRA_X,
            y: adjustRA_Y
        };



    var dataFormated_adjustDec =
        {
            name: 'Adjust',
            type: 'scatter',
            mode: 'lines+markers',
            x: adjustDEC_X,
            y: adjustDEC_Y
        };

    console.log("adjustRA_X", adjustRA_X);
    console.log("adjustRA_Y", adjustRA_Y);
    var layout = {
        title: "RA X Epoch " + name,
        xaxis: {title: "Year"},       // set the y axis title
        yaxis: {title: "RA"}       // set the y axis title
    };
    var layout2 = {
        title: "Declination X Epoch " + name,
        xaxis: {title: "Year"},       // set the y axis title
        yaxis: {title: "Dec"}       // set the y axis title
    };

    console.log("dataFormated_adjustRa",dataFormated_adjustRa);
    var data = [dataFormated_ra, dataFormated_adjustRa];
    var dataDec = [dataFormated_dec, dataFormated_adjustDec];


    Plotly.newPlot("div_ra_" + name, data , layout);
    Plotly.newPlot("div_dec_" + name, dataDec, layout2);

}


function showPlot_old() {

    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/wind_speed_laurel_nebraska.csv', function (rows) {
        var trace = {
            type: 'scatter',                    // set the chart type
            mode: 'lines',                      // connect points with lines
            x: rows.map(function (row) {          // set the x-data
                return row['Time'];
            }),
            y: rows.map(function (row) {          // set the x-data
                return row['10 Min Sampled Avg'];
            }),
            line: {                             // set the width of the line.
                width: 1
            },
            error_y: {
                array: rows.map(function (row) {    // set the height of the error bars
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
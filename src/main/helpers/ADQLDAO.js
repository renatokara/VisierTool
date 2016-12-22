import fs from 'fs'
import ADQLConnector from './ADQLConnector'
import queryJson from '../mock/queryJson.json'
import MathUtils from './MathUtils';

const flag_mock = false;
module.exports.readStarsADQL = async function () {

    const result = await new Promise(function (resolve, reject){
        try {

            fs.readFile('./src/main/helpers/stars.sql','utf8', function (err, contents){
                if (err){
                    reject(err);
                }else {
                    resolve(contents);
                }
             });

        }catch(ex){
            reject(ex);
        }
    });
    return result;
}

module.exports.writeResultingJson = async function (obj) {
    const result = new Promise(function (resolve, reject){
        try {
            const fileName = "./cache/queryJson.json";
            if (!fs.existsSync(fileName)){
                fs.writeFile(fileName, JSON.stringify(obj), {flag:'w+'}, function (err){
                    if (err){
                        reject(err);
                    }else {
                        resolve(null);
                    }
                });
            }else {
                resolve(null);
            }


        }catch(ex){
            reject(ex);
        }
    });
    return result;
}



 module.exports.searchStars = async function (ra, dec, name, tab) {
    if (flag_mock){
        return queryJson;
    }
    const query = await this.parseColumnsStarsQuery(ra, dec, name, tab);
    const jsonReturned = await ADQLConnector.executeADQL(query);

    //this.writeResultingJson(jsonReturned);
    return jsonReturned;
}

function parseColumns(tab, adql) {
    let colunas = "";
    let columnValue = "";
    for (let z in tab.columns) {
        if (tab.columns[z].match("'")){
            columnValue = tab.columns[z];
        }else {
            columnValue = wrapWith(tab.columns[z],'"');
        }

        colunas += ",\n " + columnValue  + " as " +  wrapWith(z, '"');
    }
    adql = adql.replace(/\{SELECT_FIELDS\}/g, colunas);
    return adql;
}
module.exports.parseColumnsStarsQuery =async function (ra, dec, name, tab){
    let adql = await this.readStarsADQL();
    adql = parseColumns(tab, adql);
    adql = parseNames(ra, dec, name, tab, adql);
    return adql;
}

function parseNames(ra, dec, name, tab, adql) {
    let colunas = "";

    adql = adql
        .replace(/\{STAR_NAME\}/g, wrapWith(name, "'"))
        .replace(/\{TABLE\}/g, wrapWith(tab.codigo, '"'))
        .replace(/\{RA_COLUMN\}/g, wrapWith(tab.columns.ra, '"'))
        .replace(/\{DE_COLUMN\}/g, wrapWith(tab.columns.dec,'"' ))
        .replace(/\{RA\}/g, ra)
        .replace(/\{DEC\}/g, dec);

    return adql;
}

function wrapWith(text, c){
    if (!c){
        c = "'";
    }

    return c + text + c ;
}




module.exports.transformReturnedData = function (queryJson) {
    const obj = {
        "metadata": queryJson[0].metadata,
        "stars": []
    };

    queryJson.forEach((line) => {
        let d = line.data;
        if (d[0]) {
            let item = containName(obj.stars, d[0][0]);
            if (!item) {

                obj.stars.push({"name": d[0][0], "data": new Array(d[0])});

            } else {
                item.data.push(d[0]);
            }
        }
    });

    obj.stars.forEach((s)=>{
        s.data.sort(function(a, b){
            if(a && b){
                return eval(a[5]) - eval(b[5]);
            }
            return 0;
        });

        const adjustRA = new Array();
        const adjustDEC= new Array();

        s.data.forEach((b)=>{
            adjustRA.push([eval(b[5]) , eval(b[1])]);
            adjustDEC.push([eval(b[5]) , eval(b[3])]);
        });
        s.adjustRA = MathUtils.findAproximation(adjustRA, 2);
        s.adjustDEC = MathUtils.findAproximation(adjustDEC, 2);

    })

    return obj;
}


function containName(list, name){
    for (let x in list){
        if (list[x].name && name == list[x].name){
            return list[x];
        }
    }

    return null;
}
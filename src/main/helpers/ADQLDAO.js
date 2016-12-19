import fs from 'fs'
import ADQLConnector from './ADQLConnector'
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
    const result = await new Promise(function (resolve, reject){
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
    const query = await this.parseColumnsStarsQuery(ra, dec, name, tab);
    const jsonReturned = await ADQLConnector.executeADQL(query);
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
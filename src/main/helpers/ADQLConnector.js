
import request from 'request';

module.exports.executeADQL = async function executeADQL(adql) {

    const options = {
        //host: '',
        uri: 'http://tapvizier.u-strasbg.fr/TAPVizieR/tap/sync',
        method: 'POST',
        form: {
            "phase":"RUN",
            "action":"upload",
            "lang":"adql",
            "format":"json",
            "request":"doQuery",
            "query": adql
        }
    };

    const result = await new Promise(function (resolve, reject) {
        try {
            request(options, function (err, res, body) {
                if (err) {
                    reject(err);
                    return;
                }
                console.log("adql", adql);
                resolve({response: res, body: JSON.parse(body)});
            })
        }catch(ex){
            reject(ex);
        }
    });

    return result;
};

function onReturnQueryData(ret){

}
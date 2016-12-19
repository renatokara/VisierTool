/**
 * Created by renato on 07/12/16.
 */

var express = require('express');
var router = express.Router();
var ADQLConnector = require('../helpers/ADQLConnector');
import MappedTables from '../domains/MappedTables';

import ADQLDAO from '../helpers/ADQLDAO'

// define the home page route
router.get('/', function (req, res) {
    const s = "Showing content";
    console.log(s);
    res.send('Birds home page ' + req.body.dados);
});
// define the about route
router.post('/search', async function (req, res) {
    const result = new Array();
    const val = req.body.dados;
    console.log("val",val);
    for (let line in val){
        for(let tab in MappedTables.MappedTables){
            //console.log("tab",MappedTables.MappedTables[tab])
            const requestReturnObject = await ADQLDAO.searchStars(val[line].ra, val[line].dec, val[line].name, MappedTables.MappedTables[tab]);
            console.log("statusCode",requestReturnObject.statusCode);
            //if (requestReturnObject.statusCode && requestReturnObject.statusCode == 200){
                result.push( requestReturnObject.body);
            //}
        }
    }
    await ADQLDAO.writeResultingJson(result);
    res.json(result);
});

// define the about route

router.post('/tabColumns', async function (req, res) {
    const tables = await ADQLConnector.executeADQL("select column_name from columns where table_name = '"+req.body.table +"'");
    res.json(tables);
});


router.post('/tables', async function (req, res) {
    // const tables = await ADQLConnector.executeADQL("select table_name from tables");
    // console.log(tables);
    res.json(MappedTables );
});


module.exports = router;

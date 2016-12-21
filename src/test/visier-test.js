const ADQLConnector = require("../main/helpers/ADQLConnector");
const ADQLDAO = require("../main/helpers/ADQLDAO");
const chai = require("chai");

const expect = chai.expect;

import MappedTables from '../main/domains/MappedTables'
import queryJsonObj  from '../main/mock/queryJson.json'


it("should call visier and receive response ok",async function (){
    const obj = ADQLDAO.transformReturnedData(queryJsonObj);
    console.log("obj",obj);
    for (let z in obj.stars ){
        console.log(obj.stars[z].data);
    }
});


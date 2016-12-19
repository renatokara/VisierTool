import MappedTables from '../main/domains/MappedTables'
import ADQLDAO from '../main/helpers/ADQLDAO'
const ADQLConnector = require("../main/helpers/ADQLConnector");

const chai = require("chai");

const expect = chai.expect;

it("should call visier and receive response ok",async function (){
    this.timeout(10000);
    const result = await ADQLConnector.executeADQL('select column_name from columns where table_name = \'I/337/gaia\'');
    expect(result).to.be.not.null;
    expect(result).deep.property("response.statusCode").equals(200);
    expect(result.body).property("metadata").to.be.instanceof(Array);
});


it("should call visier and list all tables",async function (){
    this.timeout(10000);
    const result = await ADQLConnector.executeADQL('select table_name from tables');
    expect(result).to.be.not.null;
    expect(result).deep.property("response.statusCode").equals(200);
    expect(result.body.data.length).to.be.greaterThan(0);
});


it("should call visier and list all columns from tables",async function (){
    this.timeout(10000);
    const result = await ADQLConnector.executeADQL('select column_name from columns where table_name = \'I/337/gaia\'');
    expect(result).to.be.not.null;
    expect(result).deep.property("response.statusCode").equals(200);
    expect(result.body.data.length).to.be.greaterThan(0);
});


it("read ADQL file",async function (){
    this.timeout(10000);
    const result = await ADQLDAO.readStarsADQL();
    expect(result).to.be.not.null;
    console.log(result);
});

it("generate adql stars query",async function (){
    this.timeout(10000);
    const result = await ADQLDAO.parseColumnsStarsQuery(165.4659259731, -34.704789396, "TWA1", MappedTables.MappedTables[2 ]);
    expect(result).to.be.not.null;
    console.log(result);
});

it.only("create JSON file",async function (){
    this.timeout(10000);
    await ADQLDAO.writeResultingJson(MappedTables.MappedTables);
    console.log("escreveu");
    //console.log(result);
});
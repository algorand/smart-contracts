import algosdk, { Transaction } from 'algosdk'
import * as fs from 'fs' 
import {Buffer} from 'buffer'
import { ENGINE_METHOD_NONE, ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants'

(async function(){

    const client = new algosdk.Algodv2(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 
        "http://127.0.0.1", 
        "4001"
    )
    
    const buffM = fs.readFileSync("method.json");
    const m1 = new algosdk.ABIMethod(JSON.parse(buffM.toString() ));
    console.log("============Method Description==================");
    //console.log(m1.toJSON());
    console.log("Method Selector " + m1.getSelector());
    console.log("Method Signature " + m1.getSignature());
    console.log("Method Name " + m1.name);
    if( m1.description)console.log("Method Desc " + m1.description);
    for (let ms of m1.args) {
        console.log(ms.type); 
    }
    console.log("Returns " + m1.returns.type);
    console.log("============Interface Description==================");
    const buffI = fs.readFileSync("interface.json")
    const i1 = new algosdk.ABIInterface(JSON.parse(buffI.toString() ))
    console.log(i1.toJSON())

    console.log("============Contract Description==================");
    const buffC = fs.readFileSync("contract.json");
    const c1 = new algosdk.ABIContract( JSON.parse(buffC.toString()));
    console.log("Contract Name: " + c1.name);
    console.log("APP ID: " + c1.appId);
    for (let mc of c1.methods) {
        console.log("Method Name " + mc.name);
        console.log("Method Signature " + mc.getSignature()); 
    }    

})()

const algosdk = require('algosdk');

// user declared account mnemonics

//fund the two accounts below before creating
//ZUJHYU5L3PJV2O7WJMNRI44H5RYFKP4GVVWM2OQASAIG7K6FXEL526VSOY
const creatorMnemonic = "distance inmate vacuum ship foil park quarter stem bench gravity like track shiver point unable earn session choose cash penalty blur depend empower about glass";
//A2PZYJLHZFM7XSNCRUXNZ2YGGHVAHYYQVIA5RE2KTJAHK7VKCQKKPHNX6A
const userMnemonic = "shadow slush resemble juice wall review alert into celery spoon ice tube such tone neither swim chef reward sweet toe lunar bright clap absorb swim";

// user declared algod connection parameters
const algodServer = "http://localhost";
const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodPort = 4001;
// declare application state storage (immutable)
localInts = 16;
localBytes = 0;
globalInts = 0;
globalBytes = 1;

// user declared approval program (initial)
var approvalProgramSourceInitial = `#pragma version 2
// check if the app is being created
// if so save creator
int 0
txn ApplicationID
==
bz not_creation
byte "Creator"
txn Sender
app_global_put
//4 args on creation
int 1
return
not_creation:
// check if this is deletion transaction
int DeleteApplication
txn OnCompletion
==
bz not_deletion
byte "Creator"
app_global_get
txn Sender
==
bz fail
int 1
return
not_deletion:
//---
// check if this is update ---
int UpdateApplication
txn OnCompletion
==
bz not_update
// verify that the creator is
// making the call
byte "Creator"
app_global_get
txn Sender
==
bz fail
int 1
return
not_update:
// check if this is update ---
int OptIn
txn OnCompletion
==
bz not_optin
int 1
return
not_optin:
int CloseOut
txn OnCompletion
==
bz not_close
int 1
return
not_close:
//normal call
int NoOp
txn OnCompletion
==
bz fail
// the call support 
// either open, close or execute
// every call has two parms
txn NumAppArgs
int 2
==
bz fail
txna ApplicationArgs 0
byte "open"
==
bnz open
txna ApplicationArgs 0
byte "close"
==
bnz close
txna ApplicationArgs 0
byte "execute"
==
bnz execute
err
open:
// only works for app call
global GroupSize
int 1
==
bz fail
int 0 //sender
txn ApplicationID //current smart contract
// 2nd arg is order number
txna ApplicationArgs 1
app_local_get_ex
// if the value already exists fail
bnz p_fail
pop
// store the ordernumber as the key
int 0
txna ApplicationArgs 1
int 1
app_local_put
int 1
return

execute:
// Must be three transacitons
global GroupSize
int 3
==
// First Transaction must be a call to a stateful contract
gtxn 0 TypeEnum
int appl
==
&&
// The second transaction must be a payment transaction 
gtxn 1 TypeEnum
int pay
==
&&
// The third transaction must be an asset transfer
gtxn 2 TypeEnum
int axfer
==
&&
bz fail
int 1 // Creator of order
txn ApplicationID // Current stateful smart contract
txna ApplicationArgs 1 // 2nd argument is order number
app_local_get_ex
bz p_fail // If the value doesnt exists fail
pop
// Delete the ordernumber
int 1 //creator of order
// 2nd arg is order number
txna ApplicationArgs 1
app_local_del
int 1
return
close:
// only works for app call
global GroupSize
int 1
==
bz fail
int 0 //account that opened order
txn ApplicationID //current smart contract
// 2nd arg is order number
txna ApplicationArgs 1
app_local_get_ex
// if the value doesnt exists fail
bz p_fail
pop
// delete the ordernumber
int 0 //account that opened order
// 2nd arg is order number
txna ApplicationArgs 1
app_local_del
int 1
return
fail:
int 0 
return
p_fail:
pop
int 0 
return
`;
 
// declare clear state program source
clearProgramSource = `#pragma version 2
int 1
`;

// helper function to compile program source  
async function compileProgram(client, programSource) {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await client.compile(programBytes).do();
    let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
    return compiledBytes;
}

// helper function to await transaction confirmation
// Function used to wait for a tx confirmation
const waitForConfirmation = async function (algodclient, txId) {
    let status = (await algodclient.status().do());
    let lastRound = status["last-round"];
      while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
          //Got the completed Transaction
          console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
          break;
        }
        lastRound++;
        await algodclient.statusAfterBlock(lastRound).do();
      }
    };

// create new application
async function createApp(client, creatorAccount, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes) {
    // define sender as creator
    sender = creatorAccount.addr;

    // declare onComplete as NoOp
    onComplete = algosdk.OnApplicationComplete.NoOpOC;

	// get node suggested parameters
    let params = await client.getTransactionParams().do();

    // create unsigned transaction
    let txn = algosdk.makeApplicationCreateTxn(sender, params, onComplete, 
                                            approvalProgram, clearProgram, 
                                            localInts, localBytes, globalInts, globalBytes,);
    let txId = txn.txID().toString();

    // Sign the transaction
    let signedTxn = txn.signTxn(creatorAccount.sk);
    console.log("Signed transaction with txID: %s", txId);

    // Submit the transaction
    await client.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    await waitForConfirmation(client, txId);

    // display results
    let transactionResponse = await client.pendingTransactionInformation(txId).do();
    let appId = transactionResponse['application-index'];
    console.log("Created new app-id: ",appId);
    return appId;
}
async function createToken(client, creatorAccount, userAccount){

    // get node suggested parameters
    let params = await client.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;
    let note = undefined;
    // Asset creation specific parameters
    // The following parameters are asset specific
    // Throughout the example these will be re-used. 
    // We will also change the manager later in the example
    let addr = creatorAccount.addr;
    // Whether user accounts will need to be unfrozen before transacting    
    let defaultFrozen = false;
    // integer number of decimals for asset unit calculation
    let decimals = 0;
    // total number of this asset available for circulation   
    let totalIssuance = 100000;
    // Used to display asset units to user    
    let unitName = "STOK";
    // Friendly name of the asset    
    let assetName = "stok";
    // Optional string pointing to a URL relating to the asset
    let assetURL = "http://someurl";
    // Optional hash commitment of some sort relating to the asset. 32 character length.
    let assetMetadataHash = undefined;

    // The following parameters are the only ones
    // that can be changed, and they have to be changed
    // by the current manager
    // Specified address can change reserve, freeze, clawback, and manager
    let manager = creatorAccount.addr;
    // Specified address is considered the asset reserve
    // (it has no special privileges, this is only informational)
    let reserve = creatorAccount.addr;
    // Specified address can freeze or unfreeze user asset holdings 
    let freeze = creatorAccount.addr;
    // Specified address can revoke user asset holdings and send 
    // them to other addresses    
    let clawback = creatorAccount.addr;

    // signing and sending "txn" allows "addr" to create an asset
    let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(addr, note,
            totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
        clawback, unitName, assetName, assetURL, assetMetadataHash, params);

    let txId = txn.txID().toString();

        // Sign the transaction
    let signedTxn = txn.signTxn(creatorAccount.sk);
    console.log("Signed transaction with txID: %s", txId);
    
    // Submit the transaction
    await client.sendRawTransaction(signedTxn).do();
    
    // Wait for confirmation
    await waitForConfirmation(client, txId);


    //let rawSignedTxn = txn.signTxn(creatorAccount.sk);

    //let tx = (await client.sendRawTransaction(rawSignedTxn).do());
    //console.log("Transaction : " + tx.txId);
    let assetID = null;
    // wait for transaction to be confirmed
    //await waitForConfirmation(client, tx.txId);
    // Get the new asset's information from the creator account
    let ptx = await client.pendingTransactionInformation(txId).do();
    assetID = ptx["asset-index"];


    let sender = userAccount.addr;
    let recipient = sender;
    // We set revocationTarget to undefined as 
    // This is not a clawback operation
    let revocationTarget = undefined;
    // CloseReaminerTo is set to undefined as
    // we are not closing out an asset
    let closeRemainderTo = undefined;
    // We are sending 0 assets
    amount = 0;
    // signing and sending "txn" allows sender to begin accepting asset specified by creator and index
    let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
            amount, note, assetID, params);
    // Must be signed by the account wishing to opt in to the asset    
    rawSignedTxn = opttxn.signTxn(userAccount.sk);
    let opttx = (await client.sendRawTransaction(rawSignedTxn).do());
    console.log("Transaction : " + opttx.txId);
    // wait for transaction to be confirmed
    await waitForConfirmation(client, opttx.txId);

    console.log( "ASSETID="+assetID);
}
async function main() {
    try {
    // initialize an algodClient
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // get accounts from mnemonic
    let creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);
    let userAccount = algosdk.mnemonicToSecretKey(userMnemonic);
    //create sample token and optin note the switch of accounts
    //useraccount will be the token creator
    await createToken(algodClient, userAccount, creatorAccount);

    // compile programs 
    let approvalProgram = await compileProgram(algodClient, approvalProgramSourceInitial);
    let clearProgram = await compileProgram(algodClient, clearProgramSource);

    // create new application
    let appId = await createApp(algodClient, creatorAccount, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes);
    console.log( "APPID="+appId);

    }
    catch (err){
        console.log("err", err);  
    }
}

main();
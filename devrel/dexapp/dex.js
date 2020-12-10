(function() {

    // Setup a connection to Algod and the Indexer
    const atoken = "yourtoken";
    const aserver = "http://127.0.0.1";
    const aport = 8080;

    const indexer_server = "yourindexer";
    const indexer_port = 443;
    const indexer_token = "yourindexertoken";

    //assetid is hard coded at the moment
    let ASSETID = 12270668;
    // This is the APPID returned after creating the stateful smart contract
    let APPID = 12867764;

    // Instantiate the indexer and algod client wrappers
    let indexerClient = new algosdk.Indexer(indexer_token, indexer_server, indexer_port);
    let algodClient = new algosdk.Algodv2(atoken, aserver, aport);
    let body = document.body;
    let ta = document.getElementById('ta');
    let po = document.getElementById('po');
    let oi = document.getElementById('oi');
    let oo = document.getElementById('oo');
    let eo = document.getElementById('eo');
    let ro = document.getElementById('ro');
    let co = document.getElementById('co');
    let la = document.getElementById('listingaccount');

    let assetid = document.getElementById('assetid');
    let min = document.getElementById('min');
    let max = document.getElementById('max');
    let D = document.getElementById('D');
    let N = document.getElementById('N');
    let buyer_assetid = document.getElementById('buyer_assetid');
    let buyer_asset_amount = document.getElementById('buyer_assets');
    let buyer_algos = document.getElementById('buyer_algos');
    assetid.value = ASSETID;
    D.value = 10000;
    N.value = 1;
    min.value = 10000;
    max.value = 1000000;


    // Using hard coded accounts. These should be changed to work with algosigner
    // or your own key management system.

    //ZUJHYU5L3PJV2O7WJMNRI44H5RYFKP4GVVWM2OQASAIG7K6FXEL526VSOY
    let mn1 = "distance inmate vacuum ship foil park quarter stem bench gravity like track shiver point unable earn session choose cash penalty blur depend empower about glass";
    let openAccount = algosdk.mnemonicToSecretKey(mn1);

    //A2PZYJLHZFM7XSNCRUXNZ2YGGHVAHYYQVIA5RE2KTJAHK7VKCQKKPHNX6A
    let mn2 = "shadow slush resemble juice wall review alert into celery spoon ice tube such tone neither swim chef reward sweet toe lunar bright clap absorb swim";
    let executeAccount = algosdk.mnemonicToSecretKey(mn2);


    // Utility method to delete the lsig file from the server
    const deleteLsigFile = async function ( fn ){

        var fdata = new FormData();
        fdata.append("data", "nothing");
        fdata.append("lsig", fn);
        fdata.append("operation", "execute")

        fetch('http://localhost:8888/server.php', {
                method: 'POST',
                body: fdata
            })
            .then(response => response.text)
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.log(error)
                throw error
            })
    }

    // Check the status of pending transactions
    const checkPending = async function(client, txid, numRoundTimeout) {

        if (client == null || txid == null || numRoundTimeout < 0) {
            throw "Bad arguments.";
        }
        let status = (await client.status().do());
        if (status == undefined) throw "Unable to get node status";

        let startingRound = status["last-round"];
        let nextRound = startingRound;
        while (nextRound < startingRound + numRoundTimeout) {
            // Check the pending tranactions
            let pendingInfo = await client.pendingTransactionInformation(txid).do();
            if (pendingInfo != undefined) {
                if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                    //Got the completed Transaction
                    console.log("Transaction " + txid + " confirmed in round " + pendingInfo["confirmed-round"]);
                    return pendingInfo;
                }
                if (pendingInfo["pool-error"] != null && pendingInfo["pool-error"].length > 0) {
                    // If there was a pool error, then the transaction has been rejected!
                    return "Transaction Rejected";
                }

            }
            nextRound++;
            await client.statusAfterBlock(nextRound).do();
        }

        if (pendingInfo != null) {
            return "Transaction Still Pending";
        }

        return null;
    }

    // Wait for a transaction to be confirmed
    const waitForConfirmation = async function(algodclient, txId) {

        let cp = await checkPending(algodclient, txId, 4);
        if (cp == null || cp == "Transaction Rjected") throw "Transaction Rejected";
        if (cp == "Transaction Still Pending") throw "Transaction Still Pending";
        console.log("Transaction confirmed in round " + cp["confirmed-round"]);
    };

    // Opt into the stateful smart contract
    async function optInApp(client, account) {
        // define sender
        sender = account.addr;
        try {
            // get node suggested parameters
            let params = await client.getTransactionParams().do();
            // comment out the next two lines to use suggested fee

            // create unsigned transaction
            let txn = algosdk.makeApplicationOptInTxn(sender, params, APPID);
            let txId = txn.txID().toString();

            // Sign the transaction
            let signedTxn = txn.signTxn(account.sk);
            console.log("Signed transaction with txID: %s", txId);

            // Submit the transaction
            await client.sendRawTransaction(signedTxn).do();

            // Wait for confirmation
            await waitForConfirmation(client, txId);

            // display results
            let transactionResponse = await client.pendingTransactionInformation(txId).do();
            console.log("Opted-in to app-id:", transactionResponse['txn']['txn']['apid'])
        } catch (e) {
            console.log(e);
            if (e.text != undefined) {
                alert(e.text);
            } else {
                alert(e);
            }
        }
    }

    // Opt out of the stateful smart contract
    async function optOutApp(client, account) {
        // define sender
        sender = account.addr;

        try {
            // get node suggested parameters
            let params = await client.getTransactionParams().do();
            // comment out the next two lines to use suggested fee

            // create unsigned transaction
            let txn = algosdk.makeApplicationCloseOutTxn(sender, params, APPID);
            let txId = txn.txID().toString();

            // Sign the transaction
            let signedTxn = txn.signTxn(account.sk);
            console.log("Signed transaction with txID: %s", txId);

            // Submit the transaction
            await client.sendRawTransaction(signedTxn).do();

            // Wait for confirmation
            await waitForConfirmation(client, txId);

            // display results
            let transactionResponse = await client.pendingTransactionInformation(txId).do();
            console.log("Opted-out of app-id:", transactionResponse['txn']['txn']['apid']);
        } catch (e) {
            console.log(e);
            if (e.text != undefined) {
                alert(e.text);
            } else {
                alert(e);
            }
        }
    }

    // Helper function to execute the order (3 transactions)
    async function executeOrder(fn, client, account, appId, appArgs, rec, lsig, amount, assetamount, assetId) {
        try {
            let params = await algodClient.getTransactionParams().do();
            let appAccts = [];
            appAccts.push(rec);
            // Call stateful contract
            let transaction1 = algosdk.makeApplicationNoOpTxn(account.addr, params, appId, appArgs, appAccts);
            // Make payment tx signed with lsig
            let transaction2 = algosdk.makePaymentTxnWithSuggestedParams(rec, account.addr, amount, undefined, undefined, params);
            // Make asset xfer
            let transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParams(account.addr, rec, undefined, undefined,
                assetamount, undefined, assetId, params);

            let txns = [transaction1, transaction2, transaction3];

            // Group both transactions
            let txgroup = algosdk.assignGroupID(txns);

            // Sign each transaction in the group 
            let signedTx1 = transaction1.signTxn(executeAccount.sk)
            let signedTx2 = algosdk.signLogicSigTransactionObject(txns[1], lsig);
            let signedTx3 = transaction3.signTxn(executeAccount.sk)

            // Combine the signed transactions
            let signed = []
            signed.push(signedTx1);
            signed.push(signedTx2.blob);
            signed.push(signedTx3);
            let tx = await algodClient.sendRawTransaction(signed).do();
            await waitForConfirmation(client, tx.txId);
            await deleteLsigFile(fn);
            buyer_assetid.value = "";
            buyer_asset_amount.value = "";
            buyer_algos.value = "";
            ta.remove(ta.selectedIndex);
            la.innerHTML = "Select Order";
            body.classList.remove("waiting");
            alert("Order Executed: " + tx.txId);
            return tx.txId;
        } catch (e) {
            console.log(e);
            if (e.text != undefined) {
                alert(e.text);
            } else {
                alert(e);
            }
        }
    }
    // call application 
    async function callApp(client, account, index, appArgs) {
        // define sender
        sender = account.addr;

        try {
            // get node suggested parameters
            let params = await client.getTransactionParams().do();

            // create unsigned transaction
            let txn = algosdk.makeApplicationNoOpTxn(sender, params, index, appArgs)
            let txId = txn.txID().toString();

            // Sign the transaction
            let signedTxn = txn.signTxn(account.sk);
            console.log("Signed transaction with txID: %s", txId);

            // Submit the transaction
            let st = await client.sendRawTransaction(signedTxn).do();
            console.log(st);
            // Wait for confirmation
            await waitForConfirmation(client, txId);

            // display results
            let transactionResponse = await client.pendingTransactionInformation(txId).do();
            console.log("Called app-id:", transactionResponse['txn']['txn']['apid'])
            if (transactionResponse['global-state-delta'] !== undefined) {
                console.log("Global State updated:", transactionResponse['global-state-delta']);
            }
            if (transactionResponse['local-state-delta'] !== undefined) {
                console.log("Local State updated:", transactionResponse['local-state-delta']);
            }
        } catch (e) {
            throw e;
        }
    }
    // Generate order number
    async function generateOrder() {
        let rtn = openAccount.addr + "-" + N.value + "-" + D.value + "-" + max.value + "-" + min.value + "-" + assetid.value
        return rtn;
    }

    // compile stateless delegate contract
    async function compileProgram(client, programSource) {
        let encoder = new TextEncoder();
        let programBytes = encoder.encode(programSource);
        let compileResponse = await client.compile(programBytes).do();
        return compileResponse;
    }

    // Stateless delegate contract template
    let delegateTemplate = `#pragma version 2
// this delegate is
// only used on an execute order
global GroupSize
int 3
==
// The first transaction must be 
// an ApplicationCall (ie call stateful smart contract)
gtxn 0 TypeEnum
int appl
==
&&
// The second transaction must be 
// an payment tx 
gtxn 1 TypeEnum
int pay
==
&&
// The third transaction must be 
// an asset xfer tx 
gtxn 2 TypeEnum
int axfer
==
&&
// The specific App ID must be called
// This should be changed after creation
// This links this contract to the stateful contract
gtxn 0 ApplicationID
int 12867764 //stateful contract app id
==
&&
// The applicaiton call must be
// A general applicaiton call 
gtxn 0 OnCompletion
int NoOp
==
&&
// verify no transaction
// contains a rekey
gtxn 0 RekeyTo
global ZeroAddress
==
&&
gtxn 1 RekeyTo
global ZeroAddress
==
&&
gtxn 2 RekeyTo
global ZeroAddress
==
&&
gtxn 0 CloseRemainderTo
global ZeroAddress
==
&& 
gtxn 1 CloseRemainderTo
global ZeroAddress
==
&& 
gtxn 2 CloseRemainderTo
global ZeroAddress
==
&& 
gtxn 0 AssetCloseTo
global ZeroAddress
==
&&
gtxn 1 AssetCloseTo
global ZeroAddress
==
&&
gtxn 2 AssetCloseTo
global ZeroAddress
==
&&
bz fail
// min algos spent
gtxn 1 Amount
int <min>
>=
// max algos spent
gtxn 1 Amount
int <max>
<=
&&
// asset id to trade for
int <assetid>
gtxn 2 XferAsset
==
&&
bz fail
// handle the rate
// gtxn[2].AssetAmount * D >= gtxn[1].Amount * N
// N units of the asset per D microAlgos
gtxn 2 AssetAmount
int <D> // put D value here
mulw // AssetAmount * D => (high 64 bits, low 64 bits)
store 2 // move aside low 64 bits
store 1 // move aside high 64 bits
gtxn 1 Amount
int <N> // put N value here
mulw
store 4 // move aside low 64 bits
store 3 // move aside high 64 bits
// compare high bits to high bits
load 1
load 3
>
bnz done
load 1
load 3
==
load 2
load 4
>=
&& // high bits are equal and low bits are ok
bnz done
err
done:
int 1
return
fail:
int 0 
return
`;

    // Function replace entered values into the delegate template                
    async function buildDelegateTemplate() {
        let res = delegateTemplate.replace("<min>", min.value);
        res = res.replace("<max>", max.value);
        res = res.replace("<assetid>", assetid.value);
        res = res.replace("<N>", N.value);
        res = res.replace("<D>", D.value);
        return res;

    }

    // get file contents
    function getBase64(file) {
        return new Promise(function(resolve, reject) {
            var oReq = new XMLHttpRequest();
            oReq.open("GET", file);
            oReq.onreadystatechange = function() {
                if (oReq.readyState === 4 && oReq.status === 200) {
                    var type = oReq.getResponseHeader('Content-Type');
                    resolve(oReq.responseText);
                } else {
                    reject
                }
            }
            oReq.onerror = reject;
            oReq.send();
        });
    }

    // create array buffer from b64 string
    function _base64ToArrayBuffer(b64) {
        var binary_string = window.atob(b64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }

    // Order list selection function
    if (ta) {
        ta.onchange = function() {
            var selectedValue = ta.options[ta.selectedIndex].value;
            //alert(selectedValue);
            let vlsa = selectedValue.split("-");
            let rec = vlsa[0];
            let n = vlsa[1];
            let d = vlsa[2];
            let max = vlsa[3];
            let min = vlsa[4];
            let assetid = vlsa[5];

            buyer_assetid.value = assetid;
            buyer_asset_amount.value = n;
            buyer_algos.value = d;
            la.innerHTML = rec;
        }
    }

    // close order
    if (co) {
        co.onclick = function() {
            (async () => {
            
            if( ta.selectedIndex == -1)return;
            var selectedValue = ta.options[ta.selectedIndex].value;
            
            let vlsa = selectedValue.split("-");
            let rec = vlsa[0];
            let n = vlsa[1];
            let d = vlsa[2];
            let max = vlsa[3];
            let min = vlsa[4];
            let assetid = vlsa[5];
            let appArgs = [];
            let enc = new TextEncoder();
            appArgs.push(enc.encode("close"));
            console.log(selectedValue);
            appArgs.push(enc.encode(selectedValue.slice(59)));
            console.log(appArgs.length);
            body.classList.add("waiting");
            await callApp(algodClient, openAccount, APPID, appArgs);
            await deleteLsigFile(selectedValue);
            body.classList.remove("waiting");
            alert("Order Closed: " + selectedValue);
            ta.remove(ta.selectedIndex);
            la.innerHTML = "Select Order";
        })().catch(e => {
            body.classList.remove("waiting");
            console.log(e);
            if (e.text != undefined) {
                alert(e.text);
            } else {
                alert(e);
            }
            return;
        });
        }
    }

    // list open orders
    if (ro) {
        ro.onclick = function() {
            ta.innerHTML = "";
            la.innerHTML = "Select Order";

            (async () => {
                body.classList.add("waiting");
                let accountInfo = await indexerClient.searchAccounts()
                    .applicationID(APPID).do();
                console.log(accountInfo);
                let accounts = accountInfo['accounts'];
                let numAccounts = accounts.length;
                for (i = 0; i < numAccounts; i++) {
                    let add = accounts[i]['address'];

                    let accountInfoResponse = await algodClient.accountInformation(add).do();
                    for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) {
                        if (accountInfoResponse['apps-local-state'][i].id == APPID) {
                            if (accountInfoResponse['apps-local-state'][i][`key-value`] != undefined) {
                                console.log("User's local state:");
                                for (let n = 0; n < accountInfoResponse['apps-local-state'][i][`key-value`].length; n++) {
                                    console.log(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
                                    let kv = accountInfoResponse['apps-local-state'][i][`key-value`]
                                    let ky = kv[n]['key'];
                                    console.log(window.atob(ky));
                                    let option = document.createElement('option');
                                    option.value = add + "-" + window.atob(ky);
                                    option.text = window.atob(ky);
                                    ta.add(option);
                                }
                            }
                        }
                    }
                    // The above code could be simplied to only make one 
                    // call to the indexer and no calls to algod, but currently
                    // The indexer has a bug
                    // bug https://github.com/algorand/indexer/issues/226
                    /*
                    let ls = accounts[i]['apps-local-state'];
                    kv = undefined;
                    if( ls != undefined ){
                        for( ii=0; ii < ls.length; ii++){
                            let id = ls[ii]['id'];
                            if( id === APPID ){
                                kv = ls[ii]['key-value'];
                            }
                        }
                    }
                    if (kv !== undefined) {
                        let orders = kv.length;
                        for (j = 0; j < orders; j++) {
                            let ky = kv[j]['key'];
                            console.log(window.atob(ky));
                            let option = document.createElement('option');
                            option.value = add + "-" + window.atob(ky);
                            option.text = window.atob(ky);
                            ta.add(option);
                        }
                    }
                    */
                }
                body.classList.remove("waiting");
            })().catch(e => {
                body.classList.remove("waiting");
                console.log(e);
            });
        }
    }

    // Execute order 
    if (eo) {
        eo.onclick = function() {
            let fn = ta.options[ta.selectedIndex].value;
            let vls = ta.options[ta.selectedIndex].text
            vlsa = fn.split("-");
            let rec = vlsa[0];
            let n = vlsa[1];
            let d = vlsa[2];
            let max = vlsa[3];
            let min = vlsa[4];
            let assetid = vlsa[5];
            body.classList.add("waiting");
            promise = getBase64('http://localhost:8888/upload/' + fn);
            promise.then(function(result) {
                console.log(result);
                bdecode = _base64ToArrayBuffer(result);
                let lsig = algosdk.logicSigFromByte(bdecode);
                console.log(lsig);
                let appArgs = [];
                var enc = new TextEncoder();
                appArgs.push(enc.encode("execute"));
                appArgs.push(enc.encode(vls));
                console.log(appArgs.length);
                executeOrder(fn, algodClient, executeAccount, APPID, appArgs, rec, lsig, parseInt(buyer_algos.value), parseInt(buyer_asset_amount.value), parseInt(buyer_assetid.value));
            });

        }
    }

    // Optin
    // Opts in both accounts - this should be changedd to optin only the logged in account
    if (oi) {
        oi.onclick = function() {
            (async () => {
                body.classList.add("waiting");
                await optInApp(algodClient, openAccount);
                await optInApp(algodClient, executeAccount);
                body.classList.remove("waiting");

            })().catch(e => {
                body.classList.remove("waiting");
                console.log(e);
            });
        }
    }

    // Optout
    // Opts out both accounts - this should be changedd to optout only the logged in account
    if (oo) {
        oo.onclick = function() {
            (async () => {
                body.classList.add("waiting");
                await optOutApp(algodClient, openAccount);
                await optOutApp(algodClient, executeAccount);
                body.classList.remove("waiting");
            })().catch(e => {
                body.classList.remove("waiting");
                console.log(e);
            });
        }
    }

    // Open order
    if (po) {
        po.onclick = function() {
            
            (async () => {
                body.classList.add("waiting");
                let program = await buildDelegateTemplate();
                let compilation = await compileProgram(algodClient, program);
                let fn = await generateOrder();
                let uintAr = _base64ToArrayBuffer(compilation.result);
                let args = null;
                let lsig = algosdk.makeLogicSig(uintAr, args);
                // sign the logic signature with an account sk
                lsig.sign(openAccount.sk);
                
                // upload lsig to a file on server
                let fdata = new FormData();
                let b64encoded = btoa(String.fromCharCode.apply(null, lsig.toByte()));
                fdata.append("data", b64encoded);
                fdata.append("lsig", fn);
                fdata.append("operation", "upload")
                fetch('http://localhost:8888/server.php', {
                        method: 'POST',
                        body: fdata
                    })
                    .then(response => response.text)
                    .then(data => {
                        console.log(data)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                
                // Call stateful teal application    
                let appArgs = [];
                var enc = new TextEncoder();
                appArgs.push(enc.encode("open"));
                console.log(fn.slice(59));
                appArgs.push(enc.encode(fn.slice(59)));
                console.log(appArgs.length);
                await callApp(algodClient, openAccount, APPID, appArgs);
                body.classList.remove("waiting");
                alert("Order Opened: " + fn.slice(59));

            })().catch(e => {
                body.classList.remove("waiting");
                console.log(e);
                if (e.text != undefined) {
                    alert(e.text);
                } else {
                    alert(e);
                }
                return;
            });
        }
    }

})();

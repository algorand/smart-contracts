import algosdk, {AtomicTransactionComposerStatus} from 'algosdk'

(async function(){
    const m = "conduct lounge drill morning want kitten banana thing call exchange minimum dial crew wine dizzy ski estate online cost rubber front rail mutual abandon cute"

    const client = new algosdk.Algodv2(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 
        "http://127.0.0.1", 
        "4001"
    )
    
    const acct = algosdk.mnemonicToSecretKey(m)

    const sp = await client.getTransactionParams().do()

    const comp = new algosdk.AtomicTransactionComposer()
    const receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
    let amount = 1000000;
    let sender = acct.addr;
    let txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, undefined, sp);
    let transactionWithSigner = {
        txn: txn,
        signer: algosdk.makeBasicAccountTransactionSigner(acct),
        //makeLogicSigAccountTransactionSigner
        //makeMultiSigAccountTransactionSigner
      };

    
 
    comp.addTransaction(transactionWithSigner)
    console.log(AtomicTransactionComposerStatus[comp.getStatus()])
    const group = comp.buildGroup()
    console.log(AtomicTransactionComposerStatus[comp.getStatus()])
    await comp.gatherSignatures()
    console.log(AtomicTransactionComposerStatus[comp.getStatus()])
    const result = await comp.execute(client, 2)
    console.log(AtomicTransactionComposerStatus[comp.getStatus()])
    const r = result
    console.log(r)
})()

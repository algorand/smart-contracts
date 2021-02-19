import algosdk from 'algosdk';
import fetch from 'node-fetch';
import config from './config.js';


class AlgoTransaction {

    algodClient = new algosdk.Algodv2(config.ALGOD_TOKEN, config.ALGOD_URL, config.ALGOD_PORT);
    sourceAccount = algosdk.mnemonicToSecretKey(config.ACCOUNT_MNEMONIC);
    max_disbursement_amount = config.MAX_ALGO_AMOUNT;


    checkValidAccount(account) {
        return algosdk.isValidAddress(account);
    }

    async getAccountInfo(account) {
        console.log(`getAccountInfo ${account}`);

        if (this.checkValidAccount(account)) {
            console.log(`looking up account info for address ${account}`);
            let accountInfo = (await this.algodClient.accountInformation(account).do());
            console.log(`account info ${JSON.stringify(accountInfo)}`);
            return accountInfo;
        }
        else {
            return JSON.stringify({"error":"invalid account address"});
        }
    }

    async checkCaptcha(captchaToken) {
        console.log(`check captcha token: ${captchaToken}`);

        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        };

        const postData = `secret=${config.CAPTCHA_SECRET_KEY}&response=${captchaToken}`

        let catchaResponse = await fetch(`${config.CAPTCHA_URL}${postData}`, options)
            .then(res => {
                return res.json();
            }).catch(err => {
                console.error(err);
            });


        console.log(`received captcha verification ${JSON.stringify(catchaResponse)}`);
        let isCaptchaValid = catchaResponse["success"];

        console.log(`captcha is valid ${isCaptchaValid}`);
        return isCaptchaValid;
    }


    async createAndSendTransaction(account, amount) {

        let transferAmount = Math.min(amount, this.max_disbursement_amount);

        console.log(`create and send Algorand transaction to account '${account}' with amount '${transferAmount}'`);

        console.log(`source account: ${this.sourceAccount.addr}`);

        let params = await this.algodClient.getTransactionParams().do();
        let note = algosdk.encodeObj("dispenser v2");

        let transaction = algosdk.makePaymentTxnWithSuggestedParams(this.sourceAccount.addr, account, transferAmount, undefined, note, params);

        let signedTransaction = transaction.signTxn(this.sourceAccount.sk);
        let transactionID = transaction.txID().toString();
        console.log(`Signed transaction ID: ${transactionID}`);

        await this.algodClient.sendRawTransaction(signedTransaction).do();

        let transactionStatus = await this.waitForConfirmation(transaction);
        if (transactionStatus !== null) {
            return {"transactionId": transactionID};
        } else {
            return "{}";
        }

    }

    waitForConfirmation = async function (transaction) {

        let status = (await this.algodClient.status().do());
        let lastRound = status["last-round"];

        for (let i = 0; i < 5; i++) {
            let pendingInfo = await this.algodClient.pendingTransactionInformation(transaction.txID()).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                console.log(`Transaction ${transaction.txID} confirmed in round ${pendingInfo["confirmed-round"]}`);
                return pendingInfo;
            }
            lastRound++;
            await this.algodClient.statusAfterBlock(lastRound).do();
        }
        return null;
    };
}

export default new AlgoTransaction();

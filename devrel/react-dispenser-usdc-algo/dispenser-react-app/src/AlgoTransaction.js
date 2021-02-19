import algosdk from 'algosdk';


class AlgoTransaction {

    SERVER_HOST = "https://dispenser-server.testnet.aws.algodev.network";
    // SERVER_HOST = "http://localhost:3001";

    checkValidAccount(account) {
        return algosdk.isValidAddress(account);
    }

    async getAccountInfo(account, updateAccountInfocallback, recaptchaToken) {

        this.updateAccountInfocallback = updateAccountInfocallback;

        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.YOUR_API_KEY,
            }
        };

        let accountInfo = await fetch(`${this.SERVER_HOST}/session/account/${account}/${recaptchaToken}`, options)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        console.log(`recieved account info ${JSON.stringify(json)}`);
                        this.updateAccountInfocallback(json);
                    });
                }
            })
    }


    async createAndSendTransaction(account, amount, updateTransactionStatusCallback, recaptchaToken) {

        console.log(`create and send Algorand transaction to account '${account}' with amount: '${amount}'`);

        this.updateTransactionStatusCallback = updateTransactionStatusCallback;

        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.YOUR_API_KEY,
            }
        };

        let transaction = await fetch(`${this.SERVER_HOST}/session/transaction/${account}/${amount}/${recaptchaToken}`, options)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        console.log(`recieved transaction info ${JSON.stringify(json)}`);

                        this.updateTransactionStatusCallback(json);
                    });
                }
            });
    }

}

export default new AlgoTransaction();

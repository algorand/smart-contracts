class CircleTransaction {

    SERVER_HOST = "https://dispenser-server.testnet.aws.algodev.network";
    // SERVER_HOST = "http://localhost:3001";

    async transferUSDC(account, amount, circleTransactionCallback, recaptchaToken) {

        console.log("create and send Circle USDC transaction to account '" + account + "'" + " with amount " + amount + " USDC");

        this.circleTransactionCallback = circleTransactionCallback;

        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };

        let transaction = await (fetch(`${this.SERVER_HOST}/session/usdctransaction/${account}/${amount}/${recaptchaToken}`, options)
            .then(res => {
                // if (res.ok) {
                res.json().then(json => {
                    console.log("recieved transaction info " + JSON.stringify(json));

                    this.circleTransactionCallback(null, json);
                });
                // }
            }).catch(err => {
                console.error(err);
                this.circleTransactionCallback(err, null);
            }));
    }

}

export default new CircleTransaction();

import pkg from 'uuid';
import fetch from 'node-fetch';
import config from './config.js';

const {v4: uuidv4} = pkg;

class CircleTransaction {

    max_disbursement_amount  = config.MAX_USDC_AMOUNT;

    async createAndSendTransaction(account, amount) {

        let transferAmount = Math.min(amount, this.max_disbursement_amount);

        console.log(`create and send Circle USDC transaction to account '${account}' with amount ${transferAmount} USDC`);

        let idempotencyKey = uuidv4();

        let body = {
            "idempotencyKey": idempotencyKey,
            "destination": {
                "type": "blockchain",
                "address": account,
                "chain": "ALGO"
            },
            "amount": {"amount": transferAmount, "currency": "USD"}
        };

        console.log(`Circle Transaction: \n  ${JSON.stringify(body)}`);

        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + config.CIRCLE_API_KEY
            },
            body: JSON.stringify(body)
        };

        let transferResponse = (await fetch(config.CIRCLE_TRANSFER_URL, options)
            .then(function (response) {
                return response.json();
            }).catch(err => {
                console.error(err);
            }));

        console.log(`transfer response:\n ${JSON.stringify(transferResponse)}`);

        return await this.waitForConfirmation(transferResponse);
    }

    sleep(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    async waitForConfirmation(transferResponse) {
        let i = 0;
        for (i; i < 15; i++) {
            await this.sleep(5000);
            let statusResponseData = await this.getTransferUSDCStatus(transferResponse.data);

            console.log(`status response Data \n ${JSON.stringify(statusResponseData)}`);

            if (statusResponseData.status === "complete") {
                return statusResponseData;
             } else if (statusResponseData.status !== "pending") {
                return statusResponseData;
            }
        }
    }

    async getTransferUSDCStatus(transferResponseData) {

        console.log(`check status of Circle USDC transaction: ${transferResponseData.id}`);

        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + config.CIRCLE_API_KEY
            }
        };

        let targetGetTransferURL = `${config.CIRCLE_TRANSFER_URL}/${transferResponseData.id}`;

        let statusResponse = await fetch(targetGetTransferURL, options)
            .then(response => {
                return response.json();
            })
            .catch(err => {
                console.error(err);
            });

        console.log(`status response: + ${JSON.stringify(statusResponse)}`);

        return statusResponse.data;
    }
}

export default new CircleTransaction();

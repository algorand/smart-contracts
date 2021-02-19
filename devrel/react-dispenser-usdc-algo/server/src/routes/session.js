import {Router} from 'express';
import AlgoTransaction from "../AlgoTransaction.js";
import CircleTransaction from "../CircleTransaction.js";

const router = Router();

router.get('/', (req, res) => {
    return res.send({"response": "hello"});
});

// Get Account Info
router.get('/account/:accountId/:recaptchaToken', async (req, res) => {
    let accountId = req.params["accountId"];
    let recaptchaToken = req.params["recaptchaToken"];
    console.log(`get accountInfo for account ${accountId} `);
    res.setHeader('Content-Type', 'application/json');

    const accountInfo = await AlgoTransaction.getAccountInfo(accountId);
    let accountInfoString = JSON.stringify(accountInfo)
    console.log(`returning account Info: ${accountInfoString}`);
    res.end(accountInfoString);

});

// Create And Send Algo Transaction
router.post('/transaction/:accountId/:amount/:recaptchaToken', async (req, res) => {
    let accountId = req.params["accountId"];
    let amount = req.params["amount"];
    let recaptchaToken = req.params["recaptchaToken"];
    console.log(`post send transaction for account ${accountId} and amount ${amount}`);
    res.setHeader('Content-Type', 'application/json');

    const isCaptchaValid = await AlgoTransaction.checkCaptcha(recaptchaToken);

    if(!isCaptchaValid) {
        res.end("{\"error\":\"invalid captcha\"}");
    } else {
        const transactionResponse = await AlgoTransaction.createAndSendTransaction(accountId, amount );
        let transactionResponseString = JSON.stringify(transactionResponse);
        console.log(`returning transaction response: ${transactionResponseString}`);
        res.end(transactionResponseString);
    }
});

// Create And Send USDC Transaction
router.post('/usdctransaction/:accountId/:amount/:recaptchaToken', async (req, res) => {
    let accountId = req.params["accountId"];
    let amount = req.params["amount"];
    let recaptchaToken = req.params["recaptchaToken"];
    console.log(`post send USDC transaction for account ${accountId} and amount ${amount}`);
    res.setHeader('Content-Type', 'application/json');

    const isCaptchaValid = await AlgoTransaction.checkCaptcha(recaptchaToken);

    if(!isCaptchaValid) {
        res.end("{\"error\":\"invalid captcha\"}");
    } else {
        const transactionResponse = await CircleTransaction.createAndSendTransaction(accountId, amount );
        let transactionResponseString = JSON.stringify(transactionResponse);
        console.log(`returning transaction response: ${transactionResponseString}`);
        res.end(transactionResponseString);
    }
});

export default router;

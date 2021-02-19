import 'process'


export default class config {
    static ALGOD_URL = process.env.ALGOD_URL;
    static ALGOD_TOKEN = process.env.ALGOD_TOKEN;
    static ALGOD_PORT = process.env.ALGOD_PORT;
    static ACCOUNT_MNEMONIC = process.env.ACCOUNT_MNEMONIC;
    static CAPTCHA_SECRET_KEY = process.env.CAPTCHA_SECRET_KEY;
    static CAPTCHA_URL = process.env.CAPTCHA_URL;
    static CIRCLE_TRANSFER_URL = process.env.CIRCLE_TRANSFER_URL;
    static CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;

    static MAX_USDC_AMOUNT = process.env.MAX_USDC_AMOUNT || 100;
    static MAX_ALGO_AMOUNT = process.env.MAX_ALGO_AMOUNT || 200000;
}

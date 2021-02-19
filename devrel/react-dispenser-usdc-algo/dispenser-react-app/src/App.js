import React from 'react';
import {Form, Field} from 'react-final-form';
import {TextField} from 'final-form-material-ui';
import Link from '@material-ui/core/Link';
import {
    Typography,
    Paper,
    Grid,
    Button,
    CssBaseline,
    CardMedia
} from '@material-ui/core';
import AlgoTransaction from './AlgoTransaction';
import CircleTransaction from './CircleTransaction';
import RadioButtonsGroup from './AssetRadioButtonsGroup';
import ReCAPTCHA from 'react-google-recaptcha';
import algorandImage from './images/algorand_logo_mark_black.png';
import CircularProgress from "@material-ui/core/CircularProgress";

const TEST_SITE_KEY = "<recaptcha-site-key>";
const NETWORK = "Testnet";
const ALGO_DIST_AMOUNT = 200000;
const USDC_DIST_AMOUNT = 100;
const USDC_ASSET_ID = 10458941;
const currencyMap = {
    'algo': 'Algos',
    'usdc': 'USDC'
};

const styles = theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
});

class App extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        this.state = {
            callback: "not fired",
            value: "[empty]",
            selection: {value: "1"},
            load: false,
            active: true,
            captchaOK: false,
            formValid: false,
            enableSubmit: false,
            algoAccountBalance: "",
            usdcAccountBalance: "",
            enableUsdc: false,
            transactionId: "",
            currency: "algo",
            progressVariant: "determinate",
        };
        this._reCaptchaRef = React.createRef();

        this.loadAccountQueryParam();
    }

    providedAccount = "";

   loadAccountQueryParam() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let providedAccount = params.get('account');

        if (providedAccount != null) {
            if (AlgoTransaction.checkValidAccount(providedAccount)) {
                console.log(`received account parameter: ${providedAccount}`);
                this.providedAccount = providedAccount;
            } else {
                console.warn(`ignoring non valid query param, account: '${providedAccount}'`);
            }
        }
        console.log(`state.account ${this.providedAccount}`);
    }


    updateAsset = (value) => {
        console.log("updateAsset:", value);
        this.setState({currency: value});
    };

    updateAccountInfo = (accountInfo) => {
        console.log("updateAccountInfo: ",  accountInfo );
        let usdcAccountBalanceString = "";
        let algoBalanceString = `Algo balance:      ${accountInfo.amount / 1000000} ${currencyMap["algo"]}`;
        console.log(`asset ${JSON.stringify(accountInfo.assets)}`);
        let foundUsdc = false;
        if (accountInfo.assets != null) {
            let idx;

            for (idx = 0; idx < accountInfo['assets'].length; idx++) {
                let assetItem = accountInfo['assets'][idx];
                if (assetItem['asset-id'] === USDC_ASSET_ID) {
                    let assetItemJson = JSON.stringify(assetItem, undefined, 2);
                    console.log(`assetItem =  ${assetItemJson}`);
                    foundUsdc = true;
                    usdcAccountBalanceString = `USDC balance:      ${assetItem.amount / 1000000} ${currencyMap["usdc"]}`;
                    break;
                }
            }
        }
        this.setState({
            algoAccountBalance: algoBalanceString,
            enabledUsdc: foundUsdc,
            usdcAccountBalance: usdcAccountBalanceString
        });
    };

    updateTransactionStatus = (transactionStatus) => {
        console.log("updateTransactionStatus:", transactionStatus.transactionId);
        this.setProgress(false);
        this.setState({transactionId: transactionStatus.transactionId});
        AlgoTransaction.getAccountInfo(this.state.account, this.updateAccountInfo, this.state.captcha);
    };

    updateCircleTransactionStatus = (err, response) => {
        console.log("circle error: " + JSON.stringify(err));
        console.log("response: " + JSON.stringify(response));
        this.setProgress(false);
        AlgoTransaction.getAccountInfo(this.state.account, this.updateAccountInfo, this.state.captcha);
        this.setState({transactionId: response.transactionHash});

    };

    setProgress(enable) {
        if (enable) {
            this.setState({progressVariant: "indeterminate"});
        } else {
            this.setState({progressVariant: "determinate"});
        }
    }

    onCaptchaChange = (value) => {
        console.log("onChange Captcha value:", value);
        this.setState({captcha: value});
        if (value === null)
            this.setState({captchaOK: false, active: true});
        else {
            this.setState({captchaOK: true});
            if (this.state.account != null) {
                AlgoTransaction.getAccountInfo(this.state.account, this.updateAccountInfo, this.state.captcha);
            }
        }
    };

    asyncScriptOnLoad = () => {
        this.setState({callback: "called!"});
        console.log("scriptLoad - reCaptcha Ref ", this._reCaptchaRef);
    };

    onSubmit = async values => {
        // set active to false after first submit
        this.setState({active: false, transactionId: ""});

        if (this.state.currency === "algo") {
            AlgoTransaction.createAndSendTransaction(values.account, ALGO_DIST_AMOUNT, this.updateTransactionStatus, this.state.captcha);
            this.setProgress(true);
        } else if (this.state.currency === "usdc") {
            CircleTransaction.transferUSDC(values.account, USDC_DIST_AMOUNT, this.updateCircleTransactionStatus, this.state.captcha);
            this.setProgress(true);
        } else {
            console.error(`unknown currency ${this.state.currency}`)
        }
    };

    validate = values => {
        this.setState({algoAccountBalance: "", enabledUsdc: false, usdcAccountBalance: ""});
        this.setState({enableSubmit: false});
        const errors = {};
        if (!values.account) {
            errors.account = 'Required';
        } else if (values.account.length !== 58) {
            errors.account = 'Wrong length';
        } else if (!AlgoTransaction.checkValidAccount(values.account)) {
            errors.account = 'Invalid account address';
        } else {
            this.setState({formValid: true, account: values.account});
            if (this.state.captchaOK && this.state.active)
                AlgoTransaction.getAccountInfo(values.account, this.updateAccountInfo, this.state.captcha );
        }
        return errors;
    };


    render() {

        return <div style={{padding: 16, margin: 'auto', maxWidth: 800}}>
            <CssBaseline/>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h1" >
                        Algorand {NETWORK} Dispenser
                    </Typography>
                </Grid>
                <Grid container item xs={6}>
                    <ReCAPTCHA
                        ref={this._reCaptchaRef}
                        onChange={this.onCaptchaChange}
                        sitekey={TEST_SITE_KEY}
                        size="normal"
                        asyncScriptOnLoad={this.asyncScriptOnLoad}
                    >
                    </ReCAPTCHA>
                </Grid>
                <Grid container item xs={6}>
                    <CardMedia
                        component="img"
                        alt="Algorand Logo"
                        height="150"
                        image={algorandImage}
                        title="Algorand"
                    />
                </Grid>
            </Grid>


            <Typography xs={6} gutterBottom>
                {`Fund your Algorand ${NETWORK} Account`}
            </Typography>
            <Form
                onSubmit={this.onSubmit}
                initialValues={{account: this.providedAccount}}
                validate={this.validate}

                render={({handleSubmit, reset, submitting, pristine, values}) => (
                    <form onSubmit={handleSubmit} noValidate>
                        <Paper style={{padding: 16}}>

                            <Grid container alignItems="flex-start" spacing={2}>

                                <Grid container item xs={5}>
                                    <RadioButtonsGroup {...this.state} onAssetChange={this.updateAsset.bind(this)}/>
                                </Grid>
                                <Grid item xs={2}>
                                    <CircularProgress variant={this.state.progressVariant} progress={0}/>
                                </Grid>
                                <Grid container item xs={5}>
                                    <Grid container alignItems="flex-start" spacing={2}>
                                        <Grid container item xs={12}>
                                            <Typography gutterBottom>
                                                {this.state.algoAccountBalance}
                                            </Typography>
                                        </Grid>
                                        <Grid container item xs={12}>
                                            <Typography gutterBottom>
                                                {this.state.usdcAccountBalance}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12}>
                                    <Field
                                        fullWidth
                                        name="account"
                                        component={TextField}
                                        label="Algorand Account"
                                        variant="outlined"
                                        value={this.state.account}
                                    />
                                </Grid>

                                <Grid container item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={!(this.state.captchaOK && this.state.formValid && this.state.active)}
                                    >
                                        Dispense
                                    </Button>
                                </Grid>

                            </Grid>
                        </Paper>
                    </form>
                )}
            />
            <Grid container>
                <Grid container item xs={12}>
                    <Typography gutterBottom>
                        {"Account Address: "}
                        <Link
                            href={`https://${NETWORK}.algoexplorer.io/address/${this.state.account}`}
                            variant="inherit"
                            color="primary"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {this.state.account}
                        </Link>
                    </Typography>
                </Grid>
                <Grid container item xs={12}>
                    <Typography gutterBottom>
                        {"Transaction ID: "}
                        <Link
                            href={`https://${NETWORK}.algoexplorer.io/tx/${this.state.transactionId}`}
                            variant="inherit"
                            color="primary"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {this.state.transactionId}
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    };
}

export default App

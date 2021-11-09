/* global AlgoSigner */
import './App.css';
import {Button, Container, Header, Message, Input, Form, Dropdown} from "semantic-ui-react";
import React, {Component, useState, useCallback} from "react";

const languageOptions = [
  { key: 'eng', text: 'English', value: 'eng' },
  { key: 'spn', text: 'Spanish', value: 'spn' },
  { key: 'rus', text: 'Russian', value: 'Russian' },
]

const ExampleAlgoSigner = ({title, buttonText, buttonAction}) => {
  const [result, setResult] = useState("");

  const onClick = useCallback(async () => {
    const r = await buttonAction();
    setResult(r);
  }, [buttonAction]);

  return (
    <>
      <Header as="h2" dividing>{title}</Header>
      <Button primary={true} onClick={onClick}>{buttonText}</Button>
      <Message>
        <code>
          {result}
        </code>
      </Message>
    </>
  );
};



const AlgoSignerSign = ({title, buttonText, buttonAction}) => {
  const [result, setResult] = useState("");

  const onClick = useCallback(async () => {
    const r = await buttonAction();
    setResult(r);
  }, [buttonAction]);

  return (
    <>
      <Header as="h2" dividing>{title}</Header>
      <Button primary={true} onClick={onClick}>{buttonText}</Button>
      <Message>
        <code>
          {result}
        </code>
      </Message>
    </>
  );
};



class SignTransaction extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// The following components are all demonstrating some features of AlgoSigner

const CheckAlgoSigner = () => {
  const action = useCallback(() => {
    if (typeof AlgoSigner !== 'undefined') {
      return "AlgoSigner is installed.";
    } else {
      return "AlgoSigner is NOT installed.";
    }
  }, []);

  return <ExampleAlgoSigner title="CheckAlgoSigner" buttonText="Check" buttonAction={action}/>
};

const GetAccounts = () => {
  const action = useCallback(async () => {
    await AlgoSigner.connect({
      ledger: 'TestNet'
    });
    const accts = await AlgoSigner.accounts({
      ledger: 'TestNet'
    });
    return JSON.stringify(accts, null, 2);
  }, []);

  return <ExampleAlgoSigner title="Get Accounts" buttonText="Check Wallet Accounts" buttonAction={action}/>
};



const SignForm = () => {
   return <Form>
    <Form.Field>
      <Input icon='user' iconPosition='left' placeholder='From Account' />
    </Form.Field>
    <Form.Field>
      <Input icon='user' iconPosition='left' placeholder='To Account' />
    </Form.Field>
    <Form.Field>
      <Input icon='money bill alternate' iconPosition='left' placeholder='Amount in microAlgos' />
    </Form.Field>
    <Form.Field>
      <Input icon='sticky note outline' iconPosition='left' placeholder='Enter Note' />
    </Form.Field>

    <Button primary={true} type='submit'>Submit</Button>
  </Form>
};



const GetParams = () => {
  const action = useCallback(async () => {
    try {
      const r = await AlgoSigner.algod({
        ledger: 'TestNet',
        path: `/v2/transactions/params`
      });
      return JSON.stringify(r, null, 2);
    } catch (e) {
      console.error(e);
      return JSON.stringify(e, null, 2);
    }
  }, []);

  return <ExampleAlgoSigner title="Get Transaction Params" buttonText="Get Transaction Params" buttonAction={action}/>
};


const App = () => {
  return (
    <Container className="App">
      <Header as="h1" dividing>First Transaction React Example</Header>
      <p>
        The Pure Stake Team provide many examples using AlgoSigner.
        See <a
        href="https://purestake.github.io/algosigner-dapp-example">https://purestake.github.io/algosigner-dapp-example</a> for
        more examples.
      </p>

      <SignForm/>

    </Container>
  );
};

export default App;

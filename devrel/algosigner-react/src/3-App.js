/* global AlgoSigner */
import './App.css';
import {Button, Container, Header, Message, Table} from "semantic-ui-react";
import {useState, useCallback} from "react";

const appId = 13793863;
/**
 * React Component displaying a title, a button doing some (AlgoSigner-related) actions
 * and a message with the result.
 *
 * @param buttonAction is a (potentially async) function called when clicking on the button
 *   and returning the result to be displayed
 */
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

// The following components are all demonstrating some features of AlgoSigner

const GetAppGlobalState = () => {
  const action = useCallback(async () => {
    try {
      const r = await AlgoSigner.indexer({
        ledger: 'TestNet',
        path: `/v2/applications/${appId}`
      });
      return JSON.stringify(r['application']['params']['global-state'][0]['value'][`uint`], null, 2);
    } catch (e) {
      console.error(e);
      return JSON.stringify(e, null, 2);
    }
  }, []);

  return <ExampleAlgoSigner title="Get Global State" buttonText="Get Global State" buttonAction={action}/>
};

const GetAppLocalState = ({who}) => {
  const action = useCallback(async () => {
    try {
      const accts = await AlgoSigner.accounts({
        ledger: 'TestNet'
      });
      const r = await AlgoSigner.indexer({
        ledger: 'TestNet',
        path: `/v2/accounts/${accts[who]['address']}`
      });
      return JSON.stringify(r['account']['apps-local-state'][0]['key-value'][0]['value']['uint'], null, 2);
    } catch (e) {
      console.error(e);
      return JSON.stringify(e, null, 2);
    }
  }, [who]);

  return <ExampleAlgoSigner title="Get Local State" buttonText="Get Local State" buttonAction={action}/>
};

const OptInApp = ({who}) => {
  const action = useCallback(async () => {
    await AlgoSigner.connect({
      ledger: 'TestNet'
    });
    const accts = await AlgoSigner.accounts({
      ledger: 'TestNet'
    });
    const txParams = await AlgoSigner.algod({
      ledger: 'TestNet',
      path: '/v2/transactions/params'
    });
    const signedTx = await AlgoSigner.sign({
      from: accts[who]['address'],
      type: 'appl',
      appIndex: appId,
      appOnComplete: 1,
      fee: txParams['min-fee'],
      firstRound: txParams['last-round'],
      lastRound: txParams['last-round'] + 1000,
      genesisID: txParams['genesis-id'],
      genesisHash: txParams['genesis-hash']
    })
    const r = await AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTx.blob
    })
    return JSON.stringify(r, null, 2);
  }, [who]);


  return <ExampleAlgoSigner title="Opt In App" buttonText="Opt In App" buttonAction={action}/>
};

const CallApp = ({who}) => {
  const action = useCallback(async () => {
    await AlgoSigner.connect({
      ledger: 'TestNet'
    });
    const accts = await AlgoSigner.accounts({
      ledger: 'TestNet'
    });
    const txParams = await AlgoSigner.algod({
      ledger: 'TestNet',
      path: '/v2/transactions/params'
    });
    const signedTx = await AlgoSigner.sign({
      from: accts[who]['address'],
      type: 'appl',
      appIndex: appId,
      appOnComplete: 0,
      appArgs: [''],
      fee: txParams['min-fee'],
      firstRound: txParams['last-round'],
      lastRound: txParams['last-round'] + 1000,
      genesisID: txParams['genesis-id'],
      genesisHash: txParams['genesis-hash']
    })
    const r = await AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTx.blob
    })
    return JSON.stringify(r, null, 2);
  }, [who]);

  return <ExampleAlgoSigner title="CallApp" buttonText="CallApp" buttonAction={action}/>
};

const TableLocalAppState = () => {
  
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Alice</Table.HeaderCell>
          <Table.HeaderCell>Bob</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell><GetAppLocalState who={0}/></Table.Cell>
          <Table.Cell><GetAppLocalState who={1}/></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell></Table.Cell>
          <Table.Cell><OptInApp who={1}/></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><CallApp who={0}/></Table.Cell>
          <Table.Cell><CallApp who={1}/></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

const App = () => {
  return (
    <Container className="App">
      <Header as="h1" dividing>Application {appId}</Header>

      <GetAppGlobalState/>

      <TableLocalAppState/>

    </Container>
  );
};

export default App;

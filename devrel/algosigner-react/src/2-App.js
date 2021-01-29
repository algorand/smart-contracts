/* global AlgoSigner */
import './App.css';
import {Button, Container, Header, Message} from "semantic-ui-react";
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

const App = () => {
  return (
    <Container className="App">
      <Header as="h1" dividing>Application {appId}</Header>

      <GetAppGlobalState/>

    </Container>
  );
};

export default App;

# Project Title

Example Algorand DEX Web Application

## Description
In this solution, we will illustrate how to connect buyers and sellers and facilitate exchange of assets in a decentralized fashion on the Algorand blockchain. We will use limit order contracts as the method of exchange, where a buyer opens an order and specifies the asset they want to purchase and at what exchange rate. This order then resides on the blockchain where any seller of the asset can fulfill the order at a later time. The solution also offers the ability for the buyer to close the order at any time.

To implement this solution, four basic operations are required. A user should be able to open, close, or execute an order. A user should also be able to list all open orders.

1. Open Order -The solution allows a buyer to create a limit order where they specify what Algorand Asset they are interested in purchasing. The order should also contain a minimum and maximum amount of micro Algos they are willing to spend and an exchange rate. In the solution we use a simple ‘N’ and ‘D’ notation to represent this exchange rate. Where ‘N’ represents the number of the Asset and ‘D’ is the micoAlgos they are willing to spend. Once entered, the user can place the order.

The order is converted into a stateless contract that is used for delegated authority. Stateless contracts can be used either as escrows or delegation. With an Escrow the funds are moved to an account where the logic determines when they leave. With delegation, the logic is signed by a user and this logic can be used later to remove funds from the signer's account. Either could have been used in this example. This solution implemented delegation, where the logic is signed by the buyer and saved to a file that is pushed to the server for later use. The signed logic is deleted when the user closes the order or the order is executed.

As part of this solution, there is a main stateful smart contract that has methods for opening, closing and executing an order. The stateless smart contract delegation logic is linked to this stateful smart contract. This is done to make the stateless delegation logic invalid if not used in conjunction with the stateful smart contract application call. 

When the user opens the order, a call is made to the stateful smart contract to open the order. The stateful smart contract stores the order number in the user’s local storage. This limits the number of open orders to 16. This could have been extended by using a different order number generator, but for simplicity and readability this limitation is used.

2. View Open Orders - Once an order has been placed, the solution provides a list box and a refresh orders button. Once clicked, the web application calls the Algorand Indexer to search all accounts that have opted into the stateful smart contract. These accounts are iterated over and their local storage values (open orders) are read back and populated into the list box.

3. Execute Open Order - Once the open orders are listed another user can login to the web application, select an open order and execute it. The executing user can specify how many of the assets they are selling and how much micro Algos they are requesting. If they specify more than the original limit order’s maximum the execution will fail. If they specify an exchange rate that is less than the original limit order specified, the execution will also fail. Once the executing user presses the execute order button, the web application will generate three transactions. The first is a call to the stateful smart contract specifying they are executing the specific order. The second is a payment transaction from the limit order lister to the execution user in the specified amount of micro Algos. The third transaction is an asset transfer from the execution user to the limit order lister’s account transferring the specified asset amount. The first and third transactions are signed by the execution user. The second transaction (payment) is signed with the stateless smart contract logic that the listing user signed earlier. These three transactions are grouped atomically and pushed to the server. With atomic transactions, if any transaction fails they all fail. This results in both parties getting what they were expecting. 

The stateful smart contract in the first transaction will clear the order from the listing user’s local state and the signed logic file is then deleted from the server.

4. Close Order - Any user that has an open order can select this open order from the list of orders and click the close order button. This simply removes the open order from the local state of the user and deletes the signed logic file from the server.

## Startup
The `createapp.sh` file will create the stateful smart contract.
This will produce an application id which should be substituted into the dex.js program as the variable APPID. In addition the delegate template should be changed to reflect the application id:
                    gtxn 0 ApplicationID
                    int 12867764 //stateful contract app id
                    ==
Additionally the indexer and algod connections should be specifiedto point your indexer and algod instances.
Finally start the web app with 
php -S localhost:8888                    

Make sure to understand that the assets that are traded require both parties to already be opted into the asset.

## Issues
The application has very little error checking and is meant as a learning exercise. Additional error checking and handling should be done before using this logic in a production application. For example, the order numbers are generated based solely on what values are used in the limit order. In the web application, this is prepended with the users address but the listing box and the stateful teal application remove this prepending. This will allow duplicate order numbers from two different users. While this does not cause issues, it can be seen as confusing. Additionally, the logic signature is uploaded unencrypted and while this should not matter it is probably good practice to secure it better. 

Additionally this example uses hard coded accounts which should be changed to either AlgoSignr or your own key management system.


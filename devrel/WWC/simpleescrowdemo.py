import base64
import os

from algosdk import *
from algosdk.logic import get_application_address
from algosdk.future.transaction import *
from algosdk.v2client import algod
from algosdk.v2client.models import DryrunRequest, DryrunSource


from sandbox import get_accounts

token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
url = "http://localhost:4001"

client = algod.AlgodClient(token, url)

def demo():
    # Create acct
    addr, pk = get_accounts()[0]
    print("Using {}".format(addr))

    # Create app
    app_id = create_app(addr, pk)
    print("Created App with id: {}".format(app_id))
    app_address = get_application_address(app_id)

    sp = client.suggested_params()
    
    unsigned_txn = PaymentTxn(addr, sp, app_address, 10000000, None, None)  
    signed_txn = unsigned_txn.sign(pk)
    #submit transaction
    txid = client.send_transaction(signed_txn)
    print("Successfully sent transaction with txID: {}".format(txid))
    result = wait_for_confirmation(client, txid, 4)
      
    sp = client.suggested_params()
    txn_group = [
        get_app_call(addr, sp, app_id, ["payme"]), 
    ]

    signed_group = [txn.sign(pk) for txn in txn_group]


    write_dryrun(signed_group, "dryrun", app_id, [addr,app_address])

    txid = client.send_transactions(signed_group)
    print("Sending grouped transaction: {}".format(txid))

    result = wait_for_confirmation(client, txid, 4)
    print("Result confirmed in round: {}".format(result['confirmed-round']))
    #print("Logs: ")
    #for log in result['logs']:
    #    print_log(log)


def write_dryrun(signed_txn, name, app_id, addrs):
    path = os.path.dirname(os.path.abspath(__file__))
    # Read in approval teal source
    app_src = open(os.path.join(path,'simpleescrow.teal')).read()

    # Add source
    sources = [
        DryrunSource(
            app_index=app_id, 
            field_name="approv", 
            source=app_src
        ), 
    ]

    # Get account info
    accounts = [client.account_info(a) for a in addrs]
    # Get app info
    app = client.application_info(app_id)

    # Create request
    drr = DryrunRequest(
        txns=signed_txn, 
        sources=sources, 
        apps=[app], 
        accounts=accounts
    )

    file_path = os.path.join(path, "{}.msgp".format(name))
    data = encoding.msgpack_encode(drr)
    with open(file_path, "wb") as f:
        f.write(base64.b64decode(data))

    print("Created Dryrun file at {}".format(file_path))



def print_log(log):
    strlog = base64.b64decode(log).decode('UTF-8')
    print("\t{}".format(strlog))

def get_app_call(addr, sp, app_id, args):
    return ApplicationCallTxn(
            addr, sp, app_id, 
            OnComplete.NoOpOC, 
            app_args=args,
    )

def create_app(addr, pk):
    # Get suggested params from network 
    sp = client.suggested_params()

    path = os.path.dirname(os.path.abspath(__file__))

    # Read in approval teal source && compile
    approval = open(os.path.join(path, 'simpleescrow.teal')).read()
    app_result = client.compile(approval)
    app_bytes = base64.b64decode(app_result['result'])
    
    # Read in clear teal source && compile 
    clear = open(os.path.join(path, 'clear.teal')).read()
    clear_result = client.compile(clear)
    clear_bytes = base64.b64decode(clear_result['result'])

    # We dont need no stinkin storage
    schema = StateSchema(0, 0)

    # Create the transaction
    create_txn = ApplicationCreateTxn(addr, sp, 0, app_bytes, clear_bytes, schema, schema)

    # Sign it
    signed_txn = create_txn.sign(pk)

    # Ship it
    txid = client.send_transaction(signed_txn)
    
    # Wait for the result so we can return the app id
    result = wait_for_confirmation(client, txid, 4)

    return result['application-index']

if __name__ == "__main__":
    demo()

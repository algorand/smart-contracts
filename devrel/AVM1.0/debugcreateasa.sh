#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS
gcmd="../../goal -d ../test/Primary"
gcmd2="../../goal -d ../test/Node"

ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)
ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)
API=$(cat ../test/Primary/algod.net)
APITOK=$(cat ../test/Primary/algod.token)

function appl {
    method=$1; shift
    ${gcmd} app call --app-id="$APPID" --from="$SMALL" --app-arg="str:$method" "$@"
}
function app-txid {
    # When app (call or optin) submits, this is how the txid is
    # printed.  Not in appl() because appl is also used with -o to
    # create tx
    grep -o -E 'txid [A-Z0-9]{52}' | cut -c 6- | head -1
}

#create asset using smart contract
TXID=$(${gcmd} app call --app-id 1 --from $ACCOUNT --app-arg "str:create" | app-txid)

echo $TXID
PTX=$(curl -H "X-Algo-API-Token: $APITOK" "http://${API}/v2/transactions/pending/${TXID}" )
TTT=$(curl -H "X-Algo-API-Token: $APITOK" "http://${API}/v2/transactions/pending/${TXID}" | grep asset-index | awk '{ print $2 }')
ASSETID=${TTT%?}
echo $PTX
echo $ASSETID
${gcmd} asset info --assetid=$ASSETID 
read -p "Press enter to optin account"
#optin account
${gcmd} asset send -a 0 --assetid $ASSETID -f ${ACCOUNT} -t ${ACCOUNT}
${gcmd2} asset send -a 0 --assetid $ASSETID -f ${ACCOUNT2} -t ${ACCOUNT2}
${gcmd2} account info -a $ACCOUNT2 
read -p "Press enter to go get some gold"
${gcmd2} app call --app-id 1 --from $ACCOUNT2 --app-arg "str:getasset" --foreign-asset $ASSETID 
${gcmd2} account info -a $ACCOUNT2 
read -p "Press enter to freeze the gold"
${gcmd} app call --app-id 1 --from $ACCOUNT --app-arg "str:freeze" --app-account $ACCOUNT2  --foreign-asset $ASSETID 
${gcmd2} account info -a $ACCOUNT2 
read -p "Press enter to claw the gold back"
${gcmd} app call --app-id 1 --from $ACCOUNT --app-arg "str:clawback" --app-account $ACCOUNT2  --foreign-asset $ASSETID 
${gcmd2} account info -a $ACCOUNT2 
read -p "Press enter to change the asset freeze account"
${gcmd} app call --app-id 1 --from $ACCOUNT --app-arg "str:config" --foreign-asset $ASSETID 
${gcmd2} asset info --assetid=$ASSETID  
read -p "Press enter to delete the gold"
${gcmd} app call --app-id 1 --from $ACCOUNT --app-arg "str:delete" --foreign-asset $ASSETID 


#--out=dump1.dr --dryrun-dump
#../../tealdbg debug createasa.teal -d dump1.dr






#${gcmd} app call --app-id 1 --from $ACCOUNT --app-arg "str:create" --out=dump1.dr --dryrun-dump
#${gcmd} clerk dryrun-remote -D dump1.dr
#../../tealdbg debug createasa.teal -d dump1.dr
#rm ./dump1.dr
#/v2/transactions/pending/{txid}
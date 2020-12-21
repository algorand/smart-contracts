#!/bin/bash
# creates and updates the app
date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

WALLET=$1


# Directory of this bash program
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

gcmd="../../goal -d ../test/Primary"
gcmd2="../../goal -d ../test/Node"

# Get one account from each node
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)
ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)


# create test asset in account 
ASSETID=$(${gcmd} asset create --creator ${ACCOUNT} --total 1000000 --unitname sectok --decimals 0 --defaultfrozen=true | awk '{ print $6 }'|tail -n 1)

${gcmd2} asset send -a 0 -f ${ACCOUNT2} -t ${ACCOUNT2}  --creator ${ACCOUNT} --assetid ${ASSETID}


APPID=$(${gcmd} app create --creator ${ACCOUNT} --app-arg "int:"${ASSETID} --app-arg "int:2" --approval-prog ./poi.teal --global-byteslices 1 --global-ints 2 --local-byteslices 0 --local-ints 1  --clear-prog ./poi-clear.teal | grep Created | awk '{ print $6 }')
echo "Asset ID="$ASSETID
echo "App ID="$APPID  

read -p "Enter AppID and AssetID into clawback-escrow.teal, save and then press any key"

# compile and fund the escrow
ESCROW=$(${gcmd} clerk compile clawback-escrow.teal | awk '{ print $2 }'|tail -n 1)
${gcmd} clerk send --to=$ESCROW --from=$ACCOUNT --amount=1000000
echo "Escrow Address="$ESCROW
${gcmd} asset config  --manager ${ACCOUNT} --new-clawback ${ESCROW} --assetid ${ASSETID}

#now lock the asset by clearing the manager
${gcmd} asset config  --manager ${ACCOUNT} --new-freezer "" --assetid ${ASSETID}
${gcmd} asset config  --manager ${ACCOUNT} --new-manager "" --assetid ${ASSETID}
${gcmd} asset info --assetid=${ASSETID}

#optin two accounts
${gcmd} app optin  --app-id $APPID  --from $ACCOUNT 
${gcmd2} app optin  --app-id $APPID --from $ACCOUNT2

echo "App ID="$APPID 
${gcmd} app read --app-id $APPID --guess-format --global --from $ACCOUNT


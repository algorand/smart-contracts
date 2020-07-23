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


# Get date timestamps to pass in
# this example only uses a 120 second fundraising time
s=120
bd=$(date '+%s')
echo ${bd}
ed=$(( $bd + $s ))
echo ${ed}

# Create the App and then update it with the stateless teal escrow
APPID=$(${gcmd} app create --creator ${ACCOUNT}   --approval-prog ./crowd_fund.teal --global-byteslices 3 --global-ints 4 --local-byteslices 0 --local-ints 1 --app-arg "int:"${bd} --app-arg "int:"${ed} --app-arg "int:1000000" --app-arg "addr:"${ACCOUNT} --clear-prog ./crowd_fund_close.teal | grep Created | awk '{ print $6 }')
UPDATE=$(${gcmd} app update --app-id=${APPID} --from ${ACCOUNT}  --approval-prog ${DIR}/../tealprogs/crowd_fund.teal   --clear-prog ${DIR}/../tealprogs/crowd_fund_close.teal --app-arg "addr:GDYDVW2MPBYN3TMQI6O353B6VZGO77SA42DBIT2RXTH23OEO6QKF5G5R4U" )

#optin the creator account
${gcmd} app optin  --app-id 1 --from $ACCOUNT 

echo "App ID="$APPID 
${gcmd} app read --app-id $APPID --guess-format --global --from $ACCOUNT


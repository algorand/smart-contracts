#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

WALLET=$1

# Directory of this bash program
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

gcmd="../../goal -d ../test/Primary"

ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)

APPID=$(${gcmd} app create --creator ${ACCOUNT}   --approval-prog ./p_vote.teal --global-byteslices 1 --global-ints 6 --local-byteslices 1 --local-ints 0 --app-arg "int:1" --app-arg "int:20" --app-arg "int:20" --app-arg "int:100" --clear-prog ./p_vote_opt_out.teal | grep Created | awk '{ print $6 }')

echo "App ID="$APPID 
${gcmd} app read --app-id $APPID --guess-format --global --from $ACCOUNT

ASSETID=$(${gcmd} asset create --creator ${ACCOUNT} --total 1000 --unitname votetkn --decimals 0  | awk '{ print $6 }'|tail -n 1)
echo "Asset ID="$ASSETID 

# need to opt in second account to new asset id
# need to send one vote token to account 2
gcmd2="../../goal -d ../test/Node"
ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)

${gcmd2} asset send -a 0 -f ${ACCOUNT2} -t ${ACCOUNT2}  --creator ${ACCOUNT} --assetid ${ASSETID} 
${gcmd} asset send -a 1 -f ${ACCOUNT} -t ${ACCOUNT2}  --creator ${ACCOUNT} --assetid ${ASSETID} 
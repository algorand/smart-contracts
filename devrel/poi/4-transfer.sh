#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

# Directory of this bash program
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

gcmd="../../goal -d ../test/Primary"
gcmd2="../../goal -d ../test/Node"

# Get one account from each node
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)
ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)
ESCROW=$(${gcmd} clerk compile clawback-escrow.teal | awk '{ print $2 }'|tail -n 1)

${gcmd} app call --app-id 3  --app-arg "str:check-level" --app-account ${ACCOUNT2} --from $ACCOUNT --out=unsginedtransaction1.tx
${gcmd} asset send -a 1000 --assetid 1 -f ${ACCOUNT} -t ${ACCOUNT2} --clawback ${ESCROW}  --out=unsginedtransaction2.tx
${gcmd} clerk send --from=$ACCOUNT --to=${ESCROW} --amount=1000 --out=unsginedtransaction3.tx

cat unsginedtransaction1.tx unsginedtransaction2.tx unsginedtransaction3.tx > combinedtransactions.tx
${gcmd} clerk group -i combinedtransactions.tx -o groupedtransactions.tx 
${gcmd} clerk split -i groupedtransactions.tx -o split.tx 
${gcmd} clerk sign -i split-0.tx -o signout-0.tx
${gcmd} clerk sign --program ./clawback-escrow.teal -i split-1.tx -o signout-1.tx 
${gcmd} clerk sign -i split-2.tx -o signout-2.tx
cat signout-0.tx signout-1.tx signout-2.tx  > signout.tx
${gcmd} clerk rawsend -f signout.tx
#${gcmd} clerk dryrun -t signout.tx --dryrun-dump  -o dr.msgp
#../../tealdbg debug poi.teal -d dr.msgp --group-index 0



#${gcmd} asset send -a 1000 --assetid $ASSETID -f ${ACCOUNT} -t ${ACCOUNT2} --clawback ${ESCROW}  --out=unsginedtransaction1.tx
#${gcmd} clerk sign --program ./clawback-escrow.teal -i ./unsginedtransaction1.tx -o ./signedtx.tx
#${gcmd} clerk rawsend -f signedtx.tx

rm *.tx
rm dump1.dr
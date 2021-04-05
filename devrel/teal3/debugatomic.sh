#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

gcmd="../../goal -d ../test/Primary"
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)


#atomic example
# tx1 - stateful call
# tx2 - payment tx
${gcmd} app call --app-id 1  --app-arg "str:test1" --from $ACCOUNT --out=unsginedtransaction1.tx  
${gcmd} clerk send --from=$ACCOUNT --to="F4HJHVIPILZN3BISEVKXL4NSASZB4LRB25H4WCSEENSPCJ5DYW6CKUVZOA" --amount=500000 --out=unsginedtransaction2.tx
cat unsginedtransaction1.tx unsginedtransaction2.tx  > combinedtransactions.tx
${gcmd} clerk group -i combinedtransactions.tx -o groupedtransactions.tx 
${gcmd} clerk split -i groupedtransactions.tx -o split.tx 
${gcmd} clerk sign -i split-0.tx -o signout-0.tx
${gcmd} clerk sign -i split-1.tx -o signout-1.tx 
cat signout-0.tx signout-1.tx  > signout.tx
${gcmd} clerk dryrun -t signout.tx --dryrun-dump  -o dr.msgp
../../tealdbg debug atomic.teal -d dr.msgp --group-index 0

#escrow demo
#fund escrow
#${gcmd} clerk send --from=$ACCOUNT --to="276I53VTGP2BBMN4KG7JYIUUN445HEVBRJRLYUMSME77DCAIO34LKWVMYI" --amount=500000 
#${gcmd} clerk send --from-program=./escrow.teal --to="F4HJHVIPILZN3BISEVKXL4NSASZB4LRB25H4WCSEENSPCJ5DYW6CKUVZOA" --amount=10000  --out=dump1.dr --dryrun-dump
#../../tealdbg debug escrow.teal -d dump1.dr

#master-secondary demo
#${gcmd} app call --app-id 2  --from $ACCOUNT --foreign-app 1  --out=dump1.dr --dryrun-dump
#../../tealdbg debug secondary.teal -d dump1.dr



rm *.tx
rm dr.msgp
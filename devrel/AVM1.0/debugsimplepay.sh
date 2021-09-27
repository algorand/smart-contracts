#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

gcmd="../../goal -d ../test/Primary"
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)

#${gcmd} app call --app-id 1  --app-arg "str:payme" --from $ACCOUNT --out=dump1.dr --dryrun-dump
#../../tealdbg debug simpleescrow.teal -d dump1.dr
#../../tealdbg debug global.teal -d dump1.dr
${gcmd} app call --app-id 1  --app-arg "str:payme" --from $ACCOUNT --out=dump1.dr
${gcmd} account dump -a WCS6TVPJRBSARHLN2326LRU5BYVJZUKI2VJ53CAWKYYHDE455ZGKANWMGM -o br1.msgp 
../../tealdbg debug ./simpleescrow.teal -t dump1.dr --painless --balance br1.msgp -g 0

#${gcmd} app call --app-id 1  --app-arg "str:payme" --from $ACCOUNT --out=txn.raw
#${gcmd} clerk dryrun -t txn.raw --dryrun-dump -o dump1.dr
#~/go/bin/tealdbg debug ./simpleescrow.teal --dryrun-req dump1.dr -g 0

#rm dump1.dr
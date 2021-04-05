#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

gcmd="../../goal -d ../test/Primary"
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)



#master-secondary demo
${gcmd} app call --app-id 2  --from $ACCOUNT --foreign-asset 1  --out=dump1.dr --dryrun-dump
../../tealdbg debug assetcheck.teal -d dump1.dr

rm ./dump1.dr
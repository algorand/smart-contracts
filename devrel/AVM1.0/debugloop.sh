#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

gcmd="../../goal -d ../test/Primary"
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)


#loopandsub
#${gcmd} app call --app-id 1  --from $ACCOUNT --app-arg "int:15" 
#${gcmd} app read --app-id 1 --guess-format --global --from $ACCOUNT
${gcmd} app call --app-id 1  --from $ACCOUNT --app-arg "int:5" --out=dump1.dr --dryrun-dump
../../tealdbg debug loopsandsub.teal -d dump1.dr
rm ./dump1.dr

#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

WALLET=$1


# Directory of this bash program
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

gcmd="/Users/jason/node/goal -d /Users/jason/node/data -w simplewebapp"

ASSETACCOUNT="A2PZYJLHZFM7XSNCRUXNZ2YGGHVAHYYQVIA5RE2KTJAHK7VKCQKKPHNX6A"
ASSETWANTER="ZUJHYU5L3PJV2O7WJMNRI44H5RYFKP4GVVWM2OQASAIG7K6FXEL526VSOY"

#create asset and optin to asset
#ASSETID= Users/jason/node/goal -d /Users/jason/node/data -w simplewebapp asset create --creator ${ASSETACCOUNT} --total 100000 --unitname STOK  --decimals 0 
${gcmd} asset send -a 0 -f ${ASSETWANTER} -t ${ASSETWANTER}  --creator ${ASSETACCOUNT} --assetid 12270668 




#!/bin/bash

SB=/Users/jason/code/sandbox/sandbox/sandbox

GOAL="$SB goal"
app_id=`cat app.id`

accts=(`$SB goal account list | awk '{print $3}'`)
ADMIN=${accts[0]}
echo "Admin = $ADMIN"

#${gcmd} app call --app-id 1 --app-arg "str:myarg"  --from $ACCOUNT 
$GOAL app call --app-id $app_id --app-arg "str:myarg" --app-arg "int:10"   --from $ADMIN --out=dump1.dr --dryrun-dump

$SB copyTo global.teal
$SB copyTo clear.teal
$SB copyTo dump1.dr
$SB tealdbg debug global.teal -d dump1.dr

./clean.sh

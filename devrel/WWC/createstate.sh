#!/bin/bash


SB=/Users/jason/code/sandbox/sandbox/sandbox
$SB copyTo global.teal
$SB copyTo clear.teal
GOAL="$SB goal"
$GOAL clerk compile global.teal
$GOAL clerk compile clear.teal

accts=(`$SB goal account list | awk '{print $3}'`)
ADMIN=${accts[0]}
echo "Admin = $ADMIN"


echo "Creating application"
app_id=`$GOAL app create --creator $ADMIN \
    --approval-prog global.teal \
    --clear-prog clear.teal\
    --global-byteslices 0 \
    --global-ints 1 \
    --local-ints 0 \
    --local-byteslices 0  | grep 'Created app' |awk '{ print $6 }' | tr -d "\r"`


echo "App ID: $app_id"


app_addr=`$GOAL app info --app-id $app_id | grep 'Application account' | awk '{ print $3 }'`
echo "App Address: $app_addr"

# Write app id and address to files so we can re-use them in other scripts
echo "$app_id" > ./app.id
echo "$app_addr" > ./app.addr


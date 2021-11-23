#!/bin/bash

SB="$HOME/sandbox/sandbox"
GOAL="$SB goal"


CREATE=false
UPDATE=true

accts=(`$GOAL account list | awk '{print $3}'`)
creator=${accts[0]}

app_name=approval.teal
clear_name=clear.teal

python3 contract.py

$SB copyTo $app_name
$SB copyTo $clear_name 

echo "$app_name"

app_id=`cat .app_id`

if $CREATE; then
    echo "Creating application"
    app_id=`$GOAL app create --creator $creator \
        --approval-prog $app_name \
        --clear-prog $clear_name \
        --global-byteslices 0 \
        --global-ints 0 \
        --local-ints 0 \
        --local-byteslices 0  | grep 'Created app' |awk '{print $6}' | tr -d '\r'`

    echo $app_id > .app_id
    echo "App ID: $app_id"
fi


if $UPDATE; then
    echo "Updating application"
    $GOAL app update --app-id $app_id \
        --from $creator \
        --approval-prog $app_name \
        --clear-prog $clear_name 
fi

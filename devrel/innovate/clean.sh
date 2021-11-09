#!/bin/bash


SB=/Users/jason/code/sandbox/sandbox/sandbox

GOAL="$SB goal"
app_id=`cat app.id`

accts=(`$SB goal account list | awk '{print $3}'`)
ADMIN=${accts[0]}
echo "Admin = $ADMIN"


echo "Deleting application"
$GOAL app delete --app-id=$app_id --from $ADMIN


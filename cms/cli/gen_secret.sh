#!/bin/bash

ENV_FILE=../../.env

source $ENV_FILE

echo $SITE_NAME;

if [ -z ${JWT_SECRET+x} ];
then
    echo "Setting secret...";
    echo "JWT_SECRET=$(uuidgen)" >> "$ENV_FILE"
    echo "SESSION_SECRET=$(uuidgen)" >> "$ENV_FILE"
else
    echo 'JWT secret already set';
    exit;
fi;

exit;

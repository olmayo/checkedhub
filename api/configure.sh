#!/bin/bash

# Load env variables from the file passed as argument 1 (or default from ../.env)
if [ -n "$1" ]; then
    ENV_FILE="$1"
else
    ENV_FILE=../.env
fi

# Load configuration files (if file exists)
set -o allexport
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
else
    echo "Error: Environment file $ENV_FILE not found. Continuing without..."
fi
if [ -f "/secrets/secrets.env" ]; then
    source "/secrets/secrets.env"
else
    echo "Error: Secrets file /secrets/secrets.env not found. Continuing without..."
fi
set +o allexport

# Copy template file to target env file
cp ./api/settings_local_base.py ./api/settings_local.py

# Replace values in target env file
sed -i -e 's|GOOGLE_OAUTH2_KEY_VALUE|'"$GOOGLE_OAUTH2_KEY_VALUE"'|g' ./api/settings_local.py
sed -i -e 's|GOOGLE_OAUTH2_SECRET_VALUE|'"$GOOGLE_OAUTH2_SECRET_VALUE"'|g' ./api/settings_local.py

cat ./api/settings_local.py
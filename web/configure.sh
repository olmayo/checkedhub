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
cp src/app/env/env-base.ts src/app/env/env.ts

# Replace values in target env file
sed -i -e 's|BACKEND_PROT_PLACEHOLDER|'"$BACKEND_PROT"'|g' src/app/env/env.ts
sed -i -e 's|BACKEND_HOST_PLACEHOLDER|'"$BACKEND_HOST"'|g' src/app/env/env.ts
sed -i -e 's|BACKEND_PORT_PLACEHOLDER|'"$BACKEND_PORT"'|g' src/app/env/env.ts
sed -i -e 's|GOOGLE_API_KEY_PLACEHOLDER|'"$GOOGLE_API_KEY"'|g' src/app/env/env.ts
sed -i -e 's|GOOGLE_OAUTH2_SECRET_VALUE|'"$GOOGLE_OAUTH2_SECRET_VALUE"'|g' src/app/env/env.ts
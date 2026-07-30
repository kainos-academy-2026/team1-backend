#!/usr/bin/env bash
set -euo pipefail

INFRA_DIR="my-infrastructure"
ENVIRONMENT="${TF_ENVIRONMENT:-dev}"
BRANCH_REF="${GITHUB_REF:-}"
LOCK_TIMEOUT="${TF_LOCK_TIMEOUT:-5m}"

case "$ENVIRONMENT" in
  dev|test|prod)
    ;;
  *)
    echo "Unsupported TF_ENVIRONMENT '$ENVIRONMENT'. Expected: dev, test, prod."
    exit 1
    ;;
esac

BACKEND_CONFIG="backends/backend-${ENVIRONMENT}.tfvars"
VAR_FILE="${ENVIRONMENT}.tfvars"

if [[ ! -f "${INFRA_DIR}/${BACKEND_CONFIG}" ]]; then
  echo "Missing backend config: ${INFRA_DIR}/${BACKEND_CONFIG}"
  exit 1
fi

if [[ ! -f "${INFRA_DIR}/${VAR_FILE}" ]]; then
  echo "Missing variable file: ${INFRA_DIR}/${VAR_FILE}"
  exit 1
fi

cd "$INFRA_DIR"

terraform init -input=false -reconfigure -backend-config="$BACKEND_CONFIG"
terraform validate

if [[ "$BRANCH_REF" == "refs/heads/main" ]]; then
  terraform apply -input=false -auto-approve -lock-timeout="$LOCK_TIMEOUT" -var-file="$VAR_FILE"
else
  terraform plan -input=false -lock-timeout="$LOCK_TIMEOUT" -var-file="$VAR_FILE" -out=tfplan
fi

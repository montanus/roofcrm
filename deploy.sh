#!/usr/bin/env bash
# Build the app image with Cloud Build and deploy it to Cloud Run.
#
# Requires:
#   - gcloud, authenticated (gcloud auth login) with access to $PROJECT_ID
#   - .env.deploy.yaml in the repo root (gitignored) — copy
#     .env.deploy.yaml.example and fill in real values first.
#
# Usage:
#   ./deploy.sh          # prompts for confirmation before deploying
#   ./deploy.sh --yes    # skip the confirmation (for CI)

set -euo pipefail

PROJECT_ID="olgadance-218922"
REGION="us-east1"
SERVICE="monty-reservations-frontend"
CLOUDSQL_INSTANCE="olgadance-218922:us-east1:reservation"
IMAGE_REPO="us-east1-docker.pkg.dev/${PROJECT_ID}/roofcrm/roofcrm"
ENV_FILE=".env.deploy.yaml"

cd "$(dirname "${BASH_SOURCE[0]}")"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "error: gcloud CLI not found. Install it: https://cloud.google.com/sdk/docs/install" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "error: $ENV_FILE not found." >&2
  echo "Copy ${ENV_FILE}.example to $ENV_FILE and fill in real values first." >&2
  exit 1
fi

TAG="$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)"
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  TAG="${TAG}-dirty"
fi
IMAGE="${IMAGE_REPO}:${TAG}"

echo "Project:       $PROJECT_ID"
echo "Region:        $REGION"
echo "Service:       $SERVICE"
echo "Image:         $IMAGE"
echo "Cloud SQL:     $CLOUDSQL_INSTANCE"
echo "Env vars from: $ENV_FILE"
echo

if [[ "${1:-}" != "--yes" ]]; then
  read -r -p "Build and deploy to the LIVE $SERVICE service? [y/N] " reply
  if [[ ! "$reply" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

echo "==> Building and pushing image via Cloud Build..."
gcloud builds submit \
  --project="$PROJECT_ID" \
  --tag="$IMAGE" \
  .

echo "==> Deploying to Cloud Run..."
gcloud run deploy "$SERVICE" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --image="$IMAGE" \
  --add-cloudsql-instances="$CLOUDSQL_INSTANCE" \
  --env-vars-file="$ENV_FILE" \
  --quiet

echo
echo "==> Deployed. Service URL:"
gcloud run services describe "$SERVICE" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --format="value(status.url)"

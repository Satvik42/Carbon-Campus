#!/bin/bash
# =========================================================================
# Carbon Compass - Google Cloud Run Deployment Automation Script
# =========================================================================
# Requirements:
# - Google Cloud SDK installed and authenticated (gcloud auth login)
# - Active GCP project set or passed as environment variable (PROJECT_ID)
# =========================================================================

set -e # Exit immediately on command errors

# Configuration Defaults (overridable via Env Variables)
PROJECT_ID=${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}
REGION=${REGION:-"us-central1"}
SERVICE_NAME=${SERVICE_NAME:-"carbon-compass"}
AR_REPO=${AR_REPO:-"carbon-compass-repo"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

# Colors for log clarity
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0;3m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}========================================================================="
echo -e "🚀 Deploying Carbon Compass to Google Cloud Run"
echo -e "=========================================================================${NC}"
echo -e "• Target Project ID  : ${YELLOW}${PROJECT_ID}${NC}"
echo -e "• Target Region      : ${YELLOW}${REGION}${NC}"
echo -e "• Cloud Run Service  : ${YELLOW}${SERVICE_NAME}${NC}"
echo -e "• Artifact Repository: ${YELLOW}${AR_REPO}${NC}"
echo -e "• Container Tag      : ${YELLOW}${IMAGE_TAG}${NC}"
echo -e "-------------------------------------------------------------------------"

# 1. Validation Checks
if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}❌ Error: GCP Project ID is not defined.${NC}"
  echo -e "Please run 'gcloud config set project [YOUR_PROJECT_ID]' or export PROJECT_ID=[YOUR_PROJECT_ID]"
  exit 1
fi

# 2. Enable Required APIs
echo -e "\n${BOLD}[Step 1/6] Enabling required Google Cloud APIs...${NC}"
gcloud services enable \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  --project="$PROJECT_ID"
echo -e "${GREEN}✓ Required APIs are enabled.${NC}"

# 3. Artifact Registry Check
echo -e "\n${BOLD}[Step 2/6] Configuring Artifact Registry...${NC}"
if ! gcloud artifacts repositories describe "$AR_REPO" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
  echo -e "Artifact Registry repository '${AR_REPO}' not found. Creating..."
  gcloud artifacts repositories create "$AR_REPO" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Docker repository for Carbon Compass" \
    --project="$PROJECT_ID"
  echo -e "${GREEN}✓ Artifact Registry repository created.${NC}"
else
  echo -e "${GREEN}✓ Artifact Registry repository already exists.${NC}"
fi

# 4. Secret Manager Integration
echo -e "\n${BOLD}[Step 3/6] Aligning Secret Manager configuration...${NC}"
if ! gcloud secrets describe GEMINI_API_KEY --project="$PROJECT_ID" &>/dev/null; then
  echo -e "Secret 'GEMINI_API_KEY' not found in Secret Manager. Initializing..."
  gcloud secrets create GEMINI_API_KEY \
    --replication-policy="automatic" \
    --project="$PROJECT_ID"
  echo -e "${YELLOW}⚠ Secret 'GEMINI_API_KEY' has been created in Secret Manager.${NC}"
  echo -e "Please configure a valid value before deploying your application:"
  echo -e "  echo -n 'your_api_key_value' | gcloud secrets versions add GEMINI_API_KEY --data-file=- --project=${PROJECT_ID}"
else
  echo -e "${GREEN}✓ Secret 'GEMINI_API_KEY' already exists in Secret Manager.${NC}"
fi

# 5. Build and Push Container using Google Cloud Build
IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}/${SERVICE_NAME}:${IMAGE_TAG}"
echo -e "\n${BOLD}[Step 4/6] Building and pushing container image via Cloud Build...${NC}"
echo -e "Target Image Destination: ${YELLOW}${IMAGE_URL}${NC}"
gcloud builds submit --tag "$IMAGE_URL" --project="$PROJECT_ID"
echo -e "${GREEN}✓ Container built and pushed to Artifact Registry.${NC}"

# 6. Setup Access Control permissions for Secret Manager
# Retrieve project number to map default compute service account
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
RUN_SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo -e "\n${BOLD}[Step 5/6] Granting Secret Manager Accessor roles to Service Account...${NC}"
echo -e "Service Account: ${YELLOW}${RUN_SERVICE_ACCOUNT}${NC}"
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${RUN_SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project="$PROJECT_ID" --quiet
echo -e "${GREEN}✓ IAM bindings successfully configured.${NC}"

# 7. Deploy to Google Cloud Run
echo -e "\n${BOLD}[Step 6/6] Deploying service to Cloud Run...${NC}"
gcloud run deploy "$SERVICE_NAME" \
  --image="$IMAGE_URL" \
  --region="$REGION" \
  --platform="managed" \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --project="$PROJECT_ID"

# Get deployment details
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" --format="value(status.url)")

echo -e "\n${GREEN}${BOLD}========================================================================="
echo -e "🎉 Carbon Compass has been successfully deployed!"
echo -e "=========================================================================${NC}"
echo -e "• Service URL: ${BOLD}${GREEN}${SERVICE_URL}${NC}"
echo -e "• Region     : ${REGION}"
echo -e "========================================================================="

# Carbon Compass - Google Cloud Run Deployment Guide

This guide provides step-by-step instructions to create, configure, and automate the deployment of Carbon Compass on Google Cloud Run.

---

## 📋 Prerequisites
* A Google Cloud Platform (GCP) account.
* The Google Cloud SDK (`gcloud` CLI) installed and authenticated on your local machine.
* Git repository with your codebase pushed to GitHub.

---

## 🚀 Step-by-Step Setup

### Step 1: Create a GCP Project
If you do not have an active GCP project, create one using the CLI or GCP Console:
```bash
# Define your unique project ID
export PROJECT_ID="carbon-compass-prod"

# Create the project
gcloud projects create $PROJECT_ID --name="Carbon Compass Production"

# Set the active project in your local gcloud context
gcloud config set project $PROJECT_ID
```

> [!NOTE]
> Make sure billing is enabled for your GCP project under the Billing section in the Cloud Console.

---

### Step 2: Enable Required APIs
Deploying to Cloud Run via containers requires enabling several Google API services:
```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  --project=$PROJECT_ID
```

---

### Step 3: Setup Google Secret Manager
To prevent exposing your Gemini API Key in the source code or build logs, create a secure secret containing the key:

1. **Create the secret container**:
   ```bash
   gcloud secrets create GEMINI_API_KEY \
     --replication-policy="automatic" \
     --project=$PROJECT_ID
   ```
2. **Add your actual Gemini API Key as a version**:
   ```bash
   echo -n "YOUR_ACTUAL_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=- --project=$PROJECT_ID
   ```

---

### Step 4: Configure Service Permissions (IAM)
Cloud Run services run under a service account. By default, it uses the Compute Engine Default Service Account (`[PROJECT_NUMBER]-compute@developer.gserviceaccount.com`).
We must grant this account access to read the secret:

1. **Retrieve the Project Number**:
   ```bash
   export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
   export RUN_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
   ```
2. **Bind Secret Accessor permissions**:
   ```bash
   gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
     --member="serviceAccount:$RUN_SA" \
     --role="roles/secretmanager.secretAccessor" \
     --project=$PROJECT_ID
   ```

---

### Step 5: Automate Build & Push using Cloud Build
We can execute builds via Google Cloud Build to create and push our optimized container image:

1. **Create Artifact Registry Docker Repository**:
   ```bash
   gcloud artifacts repositories create carbon-compass-repo \
     --repository-format=docker \
     --location="us-central1" \
     --description="Docker Repository for Carbon Compass" \
     --project=$PROJECT_ID
   ```
2. **Build and push utilizing the deploy script**:
   ```bash
   # Run the deployment helper script (which handles building, pushing, and deploying)
   export PROJECT_ID=$PROJECT_ID
   export REGION="us-central1"
   ./deploy.sh
   ```
   *Alternatively, submit the build manually*:
   ```bash
   gcloud builds submit --config=cloudbuild.yaml \
     --substitutions=PROJECT_ID=$PROJECT_ID,_REGION="us-central1",_SERVICE_NAME="carbon-compass",_AR_REPO="carbon-compass-repo" \
     --project=$PROJECT_ID
   ```

---

### Step 6: GitHub Actions Integration
To automatically trigger deployments upon committing to your repository:
1. Generate a Service Account Key on GCP with permissions:
   * `Artifact Registry Writer`
   * `Cloud Run Developer`
   * `Cloud Build Editor`
   * `Service Account User`
2. Add the credentials to your GitHub repository secrets:
   * **`GCP_SA_KEY`**: The complete JSON key file generated for the Service Account.
   * **`GCP_PROJECT_ID`**: Your active GCP Project ID.
3. Once pushed, the workflow in [deploy.yml](file:///Users/satvikum/Documents/Carbon%20compass/.github/workflows/deploy.yml) will audit, test, compile, and deploy to Cloud Run automatically.

---

## 🌐 Domain Mapping

If you want to configure a custom domain (e.g., `carboncompass.yourdomain.com`) to point to your Cloud Run service:

1. **Navigate to Domain Mappings**:
   Go to Cloud Run -> **Manage Custom Domains** page in the Cloud Console.
2. **Add Mapping**:
   Click **Add Mapping**, select your service (`carbon-compass`), and input your verified domain name.
3. **Configure DNS Records**:
   Google Cloud will provide a set of `CNAME` or `A`/`AAAA` records. Add these records in your DNS Provider console (e.g. Cloudflare, GoDaddy).
4. **SSL Provisioning**:
   Google automatically provisions a free managed SSL certificate for your domain. This might take up to 2-3 hours to propagate and activate.

---

## 🔄 Rollback Procedures

If a deployment introduces a critical bug or performance regression, Cloud Run allows zero-downtime instant rollbacks to previous stable versions:

### Option A: Using the CLI (Recommended)
1. **List existing revisions**:
   ```bash
   gcloud run revisions list --service=carbon-compass --region=us-central1 --project=$PROJECT_ID
   ```
2. **Route traffic to the previous stable revision**:
   Find the revision name of your previous stable deployment (e.g., `carbon-compass-00003-abc`) and run:
   ```bash
   gcloud run services update-traffic carbon-compass \
     --to-revisions=carbon-compass-00003-abc=100 \
     --region=us-central1 \
     --project=$PROJECT_ID
   ```
   This immediately switches 100% of network traffic back to the previous deployment version.

### Option B: Using the GCP Console
1. Open the **Cloud Run** console and click on `carbon-compass`.
2. Click on the **Revisions** tab.
3. Click **Manage Traffic**.
4. Adjust the traffic percentage. Assign **100%** to the target stable revision and click **Save**.

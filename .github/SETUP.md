# GitHub Actions & Azure Setup Guide

## Prerequisites for CI/CD Pipeline

### GitHub Secrets Configuration

Configure the following secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

#### Azure Service Principal Secrets
- **`AZURE_CLIENT_ID`** - Service Principal Application ID
- **`AZURE_CLIENT_SECRET`** - Service Principal Password/Secret
- **`AZURE_TENANT_ID`** - Azure Tenant ID
- **`AZURE_SUBSCRIPTION_ID`** - Azure Subscription ID

#### Azure Container Registry Configuration
- **GitHub Variable**: **`ACR_NAME`** - Your ACR registry name (e.g., `myregistry`)
- The workflow derives the login server URL automatically via Azure CLI (`az acr show`).

### Creating Azure Service Principal

To create a Service Principal for GitHub Actions:

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "github-actions-team1-backend" \
  --role "AcrPush" \
  --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.ContainerRegistry/registries/{ACR_NAME}
```

The output will include:
- `clientId` → Use as `AZURE_CLIENT_ID`
- `clientSecret` → Use as `AZURE_CLIENT_SECRET`
- `tenantId` → Use as `AZURE_TENANT_ID`

### Image Tagging Strategy

The pipeline uses a flexible tagging strategy:
- **Short SHA tag**: `myregistry.azurecr.io/team1-backend:abc1234` (first 7 chars of commit SHA)
- **Latest tag**: `myregistry.azurecr.io/team1-backend:latest` (always points to latest main build)

This allows you to:
- Track exactly which commit produced an image
- Always have a stable `latest` reference for deployments
- Enable easy rollbacks by referencing specific SHAs

### Pipeline Jobs

1. **Stage 1 - Test and Quality Checks** (all branches)
   - Runs on every PR and push
   - Tests, linting, and build verification

2. **Stage 2 - Build Container Image** (all branches)
   - Builds Docker image only if tests pass
   - Caches layers for faster builds
   - Saves artifact for manual deployments (3-day retention)

3. **Stage 3 - Push to Azure Container Registry** (main branch only)
   - Only runs on merges to `main`
   - Authenticates using Service Principal
   - Pushes image with commit SHA and `latest` tags
   - Verifies successful push

### Verifying Setup

After configuring secrets, push to main branch and check:

1. **GitHub Actions Dashboard**
   - View workflow run status in Actions tab
   - Check logs for each job stage

2. **Azure Portal / Azure CLI**
   ```bash
   # List images in ACR
   az acr repository list --name {ACR_NAME}
   
   # List tags for a specific image
   az acr repository show-tags --name {ACR_NAME} --repository team1-backend
   ```

### Troubleshooting

**"Failed to login to Azure"**
- Verify `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID` are correct
- Ensure Service Principal has appropriate permissions (AcrPush role)

**"Unauthorized: authentication required"**
- Verify `ACR_NAME` is set as a GitHub Actions variable
- Confirm Service Principal has AcrPush role on the ACR resource

**"Image not found in ACR"**
- Check if the push-to-acr job ran (only runs on main branch)
- Verify ACR repository name is correct

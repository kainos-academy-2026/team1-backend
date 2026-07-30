# Terraform Backend Configuration

This directory contains environment-specific backend configurations for Terraform state management.

## Usage

When initializing Terraform for a specific environment, use the `-backend-config` flag to load the appropriate backend configuration:

### Development
```bash
terraform init -backend-config=backends/backend-dev.tfvars
```

### Test
```bash
terraform init -backend-config=backends/backend-test.tfvars
```

### Production
```bash
terraform init -backend-config=backends/backend-prod.tfvars
```

For CI/CD, use non-interactive flags:

```bash
terraform init -input=false -reconfigure -backend-config=backends/backend-dev.tfvars
```

## Service Principal Authentication (Pipeline)

The `azurerm` backend and provider can authenticate with a service principal. In GitHub Actions, set these environment variables from secrets:

```bash
ARM_CLIENT_ID
ARM_CLIENT_SECRET
ARM_TENANT_ID
ARM_SUBSCRIPTION_ID
```

Optional, if using OIDC instead of a client secret:

```bash
ARM_USE_OIDC=true
```

## Branch Behaviour

- Feature/pull request branches: run `terraform plan -input=false`
- `main`: run `terraform apply -input=false -auto-approve`

This repository includes [scripts/terraform-ci.sh](../../scripts/terraform-ci.sh) to enforce this behaviour consistently.

## Configuration Files

- **backend-dev.tfvars** - Development environment state storage
- **backend-test.tfvars** - Test environment state storage
- **backend-prod.tfvars** - Production environment state storage

Each configuration specifies:
- `resource_group_name` - Azure resource group for state management
- `storage_account_name` - Storage account name
- `container_name` - Blob storage container
- `key` - State file path/key within the container
- `use_azuread_auth` - Authentication method (Azure AD)

## Notes

- The storage account name is shared across environments (as per Azure naming constraints)
- Each environment has its own resource group to isolate state
- State files are stored in environment-specific keys
- Authentication uses Azure AD for security

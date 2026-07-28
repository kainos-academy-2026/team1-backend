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

# Production environment backend configuration
resource_group_name  = "rg-team1-tfstate-dev"
storage_account_name = "stteam1tfstate260728"
container_name       = "tfstate"
key                  = "team1-backend-prod.tfstate"
use_azuread_auth     = true

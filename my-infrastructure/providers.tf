terraform {
  required_version = ">= 1.5.0"

  backend "azurerm" {
    # Backend settings are supplied via -backend-config for each environment,
    # for example backends/backend-dev.tfvars or backends/backend-prod.tfvars.
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
}
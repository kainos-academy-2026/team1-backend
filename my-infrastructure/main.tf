terraform {
  required_version = ">= 1.5.0"

  backend "azurerm" {
    resource_group_name  = "rg-team1-tfstate-dev"
    storage_account_name = "stteam1tfstate260728"
    container_name       = "tfstate"
    key                  = "team1-backend-dev.tfstate"
    use_azuread_auth     = true
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

locals {
  # Allow an override, otherwise build a predictable RG name from project + environment.
  effective_resource_group_name = var.resource_group_name != "" ? var.resource_group_name : "${var.name_prefix}-${var.project_name}-${var.environment}"
}

module "resource_group" {
  source = "./modules/resource-group"

  name     = local.effective_resource_group_name
  location = var.location
  tags     = merge(var.tags, { environment = var.environment })
}

moved {
  from = azurerm_resource_group.main
  to   = module.resource_group.azurerm_resource_group.this
}

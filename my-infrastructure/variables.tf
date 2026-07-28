variable "resource_group_name" {
  description = "Optional explicit name for the Azure Resource Group. Leave empty to auto-generate from prefix, project, and environment."
  type        = string
  default     = ""

  validation {
    condition     = var.resource_group_name == "" || can(regex("^[a-zA-Z0-9._()\\-]{1,90}$", var.resource_group_name))
    error_message = "resource_group_name must be empty or 1-90 chars using letters, numbers, dot, underscore, hyphen, and parentheses."
  }
}

variable "location" {
  description = "Azure region where resources are created, for example uksouth or westeurope."
  type        = string
  default     = "uksouth"

  validation {
    condition     = length(trimspace(var.location)) > 0
    error_message = "location cannot be empty."
  }
}

variable "environment" {
  description = "Deployment environment. Allowed values are dev, test, or prod."
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "environment must be one of: dev, test, prod."
  }
}

variable "project_name" {
  description = "Short project identifier used in naming when resource_group_name is not set."
  type        = string
  default     = "team1-backend"

  validation {
    condition     = can(regex("^[a-z0-9-]{3,30}$", var.project_name))
    error_message = "project_name must be 3-30 chars and contain lowercase letters, numbers, or hyphens."
  }
}

variable "name_prefix" {
  description = "Naming prefix used for auto-generated resource group names."
  type        = string
  default     = "rg"

  validation {
    condition     = can(regex("^[a-z0-9-]{2,10}$", var.name_prefix))
    error_message = "name_prefix must be 2-10 chars and contain lowercase letters, numbers, or hyphens."
  }
}

variable "tags" {
  description = "Optional custom tags to apply to resources (will merge with default_tags)."
  type        = map(string)
  default     = {}
}

variable "default_tags" {
  description = "Default tags to apply to all resources if not overridden."
  type        = map(string)
  default = {
    owner      = "team1"
    managed_by = "terraform"
    project    = "team1-backend"
  }
}

variable "backend_resource_group_name" {
  description = "Resource group name for Terraform state backend storage."
  type        = string
  default     = "rg-team1-tfstate-dev"
}

variable "backend_storage_account_name" {
  description = "Storage account name for Terraform state backend."
  type        = string
  default     = "stteam1tfstate260728"
}

variable "backend_container_name" {
  description = "Container name in storage account for Terraform state."
  type        = string
  default     = "tfstate"
}

variable "backend_state_key" {
  description = "Key/path for the Terraform state file in backend storage."
  type        = string
  default     = "team1-backend-dev.tfstate"
}
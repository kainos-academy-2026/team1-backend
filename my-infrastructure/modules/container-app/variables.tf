variable "name" {
  description = "Name of the Container App."
  type        = string
}

variable "container_app_environment_id" {
  description = "ID of the Container App Environment."
  type        = string
}

variable "resource_group_name" {
  description = "Name of the Resource Group."
  type        = string
}

variable "revision_mode" {
  description = "Revision mode used by the Container App."
  type        = string
  default     = "Single"
}

variable "identity_id" {
  description = "ID of the user-assigned managed identity."
  type        = string
}

variable "registry_server" {
  description = "Login server of the Azure Container Registry."
  type        = string
}

variable "external_enabled" {
  description = "Whether ingress is publicly accessible."
  type        = bool
}

variable "target_port" {
  description = "Port exposed by the application container."
  type        = number
}

variable "container_name" {
  description = "Name of the container."
  type        = string
}

variable "image" {
  description = "Full container image reference."
  type        = string
}

variable "cpu" {
  description = "CPU cores allocated to the container."
  type        = number
  default     = 0.5
}

variable "memory" {
  description = "Memory allocated to the container."
  type        = string
  default     = "1Gi"
}

variable "key_vault_secrets" {
  description = "Map of Container App secret names to Key Vault secret IDs."
  type        = map(string)
  default     = {}
}

variable "environment_variables" {
  description = "Environment variables with either a plain value or Container App secret name."
  type = map(object({
    value       = optional(string)
    secret_name = optional(string)
  }))
  default = {}

  validation {
    condition = alltrue([
      for environment_variable in values(var.environment_variables) :
      (environment_variable.value != null) != (environment_variable.secret_name != null)
    ])
    error_message = "Each environment variable must set exactly one of value or secret_name."
  }
}

variable "tags" {
  description = "Tags to apply to the Container App."
  type        = map(string)
  default     = {}
}
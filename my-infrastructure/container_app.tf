variable "image_tag" {
  description = "Docker image tag to deploy to the Container Apps."
  type        = string
  default     = "latest"
}

module "backend_container_app" {
  source = "./modules/container-app"

  name                         = "ca-team1-backend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.app.id
  resource_group_name          = module.resource_group.resource_group_name
  identity_id                  = azurerm_user_assigned_identity.app.id
  registry_server              = data.azurerm_container_registry.app.login_server
  external_enabled             = false
  target_port                  = 3001
  container_name               = "team1-backend"
  image                        = "${data.azurerm_container_registry.app.login_server}/team1-backend:${var.image_tag}"
  tags                         = local.merged_tags

  key_vault_secrets = {
    "database-url"          = "${azurerm_key_vault.app.vault_uri}secrets/database-url"
    "jwt-secret-key"        = "${azurerm_key_vault.app.vault_uri}secrets/jwt-secret-key"
    "aws-region"            = "${azurerm_key_vault.app.vault_uri}secrets/aws-region"
    "s3-bucket-name"        = "${azurerm_key_vault.app.vault_uri}secrets/s3-bucket-name"
    "aws-access-key-id"     = "${azurerm_key_vault.app.vault_uri}secrets/aws-access-key-id"
    "aws-secret-access-key" = "${azurerm_key_vault.app.vault_uri}secrets/aws-secret-access-key"
    "aws-iam-user-name"     = "${azurerm_key_vault.app.vault_uri}secrets/aws-iam-user-name"
  }

  environment_variables = {
    DATABASE_URL = {
      secret_name = "database-url"
    }
    JWT_SECRET_KEY = {
      secret_name = "jwt-secret-key"
    }
    AWS_REGION = {
      secret_name = "aws-region"
    }
    S3_BUCKET_NAME = {
      secret_name = "s3-bucket-name"
    }
    AWS_ACCESS_KEY_ID = {
      secret_name = "aws-access-key-id"
    }
    AWS_SECRET_ACCESS_KEY = {
      secret_name = "aws-secret-access-key"
    }
    AWS_IAM_USER_NAME = {
      secret_name = "aws-iam-user-name"
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_role_assignment.kv_secrets_user,
  ]
}

module "frontend_container_app" {
  source = "./modules/container-app"

  name                         = "ca-team1-frontend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.app.id
  resource_group_name          = module.resource_group.resource_group_name
  identity_id                  = azurerm_user_assigned_identity.app.id
  registry_server              = data.azurerm_container_registry.app.login_server
  external_enabled             = true
  target_port                  = 3000
  container_name               = "team1-frontend"
  image                        = "${data.azurerm_container_registry.app.login_server}/team1-frontend:${var.image_tag}"
  tags                         = local.merged_tags

  environment_variables = {
    NEXT_PUBLIC_API_URL = {
      value = "https://${module.backend_container_app.fqdn}"
    }
  }

  depends_on = [azurerm_role_assignment.acr_pull]
}

moved {
  from = azurerm_container_app.app
  to   = module.backend_container_app.azurerm_container_app.this
}

moved {
  from = azurerm_container_app.frontend
  to   = module.frontend_container_app.azurerm_container_app.this
}
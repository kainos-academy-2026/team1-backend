variable "image_tag" {
  description = "Docker image tag to deploy to the Container App."
  type        = string
  default     = "latest"
}

resource "azurerm_container_app" "app" {
  name                         = "ca-team1-backend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.app.id
  resource_group_name          = module.resource_group.resource_group_name
  revision_mode                = "Single"
  tags                         = local.merged_tags

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.app.id]
  }

  registry {
    server   = data.azurerm_container_registry.app.login_server
    identity = azurerm_user_assigned_identity.app.id
  }

  ingress {
    external_enabled = false
    target_port      = 3001
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  secret {
    name                = "database-url"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/database-url"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "jwt-secret-key"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/jwt-secret-key"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "aws-region"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/aws-region"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "s3-bucket-name"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/s3-bucket-name"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "aws-access-key-id"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/aws-access-key-id"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "aws-secret-access-key"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/aws-secret-access-key"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "aws-iam-user-name"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/aws-iam-user-name"
    identity            = azurerm_user_assigned_identity.app.id
  }

  template {
    container {
      name   = "team1-backend"
      image  = "${data.azurerm_container_registry.app.login_server}/team1-backend:${var.image_tag}"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }

      env {
        name        = "JWT_SECRET_KEY"
        secret_name = "jwt-secret-key"
      }

      env {
        name        = "AWS_REGION"
        secret_name = "aws-region"
      }

      env {
        name        = "S3_BUCKET_NAME"
        secret_name = "s3-bucket-name"
      }

      env {
        name        = "AWS_ACCESS_KEY_ID"
        secret_name = "aws-access-key-id"
      }

      env {
        name        = "AWS_SECRET_ACCESS_KEY"
        secret_name = "aws-secret-access-key"
      }

      env {
        name        = "AWS_IAM_USER_NAME"
        secret_name = "aws-iam-user-name"
      }
    }
  }
}

resource "azurerm_container_app" "this" {
  name                         = var.name
  container_app_environment_id = var.container_app_environment_id
  resource_group_name          = var.resource_group_name
  revision_mode                = var.revision_mode
  tags                         = var.tags

  identity {
    type         = "UserAssigned"
    identity_ids = [var.identity_id]
  }

  registry {
    server   = var.registry_server
    identity = var.identity_id
  }

  ingress {
    external_enabled = var.external_enabled
    target_port      = var.target_port

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  dynamic "secret" {
    for_each = var.key_vault_secrets

    content {
      name                = secret.key
      key_vault_secret_id = secret.value
      identity            = var.identity_id
    }
  }

  template {
    container {
      name   = var.container_name
      image  = var.image
      cpu    = var.cpu
      memory = var.memory

      dynamic "env" {
        for_each = var.environment_variables

        content {
          name        = env.key
          value       = env.value.value
          secret_name = env.value.secret_name
        }
      }
    }
  }
}
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

  template {
    container {
      name   = "team1-backend"
      image  = "${data.azurerm_container_registry.app.login_server}/team1-backend:${var.image_tag}"
      cpu    = 0.5
      memory = "1Gi"
    }
  }
}

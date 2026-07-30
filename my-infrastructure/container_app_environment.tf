resource "azurerm_log_analytics_workspace" "app" {
  name                = "log-team1-backend-${var.environment}"
  location            = module.resource_group.resource_group_location
  resource_group_name = module.resource_group.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.merged_tags
}

resource "azurerm_container_app_environment" "app" {
  name                       = "cae-team1-backend-${var.environment}"
  location                   = module.resource_group.resource_group_location
  resource_group_name        = module.resource_group.resource_group_name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.app.id
  tags                       = local.merged_tags
}

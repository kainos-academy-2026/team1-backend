resource "azurerm_container_registry" "app" {
  name                = "crteam1backend${var.environment}"
  location            = module.resource_group.resource_group_location
  resource_group_name = module.resource_group.resource_group_name
  sku                 = "Basic"
  admin_enabled       = false
  tags                = local.merged_tags
}

# Grant the managed identity permission to pull images from ACR
resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.app.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.app.principal_id
}

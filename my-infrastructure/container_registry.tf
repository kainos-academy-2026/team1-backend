data "azurerm_container_registry" "app" {
  name                = "acraiacademy26"
  resource_group_name = "rg-ai-academy-26"
}

# Grant the managed identity permission to pull images from the shared ACR
resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.app.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.app.principal_id
}

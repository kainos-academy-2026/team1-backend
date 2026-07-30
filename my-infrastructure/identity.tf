resource "azurerm_user_assigned_identity" "app" {
  name                = "id-team1-backend-${var.environment}"
  location            = module.resource_group.resource_group_location
  resource_group_name = module.resource_group.resource_group_name
  tags                = local.merged_tags
}

# Grant the identity access to Key Vault secrets
resource "azurerm_role_assignment" "kv_secrets_user" {
  scope                = azurerm_key_vault.app.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.app.principal_id
}

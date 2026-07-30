resource "azurerm_key_vault" "app" {
  name                = "kv-team1-backend-dev"
  location            = module.resource_group.resource_group_location
  resource_group_name = module.resource_group.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  purge_protection_enabled   = true
  soft_delete_retention_days = 7

  rbac_authorization_enabled    = true
  public_network_access_enabled = true
}

resource "azurerm_role_assignment" "kv_secrets_officer" {
  scope                = azurerm_key_vault.app.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azurerm_client_config.current.object_id
}

data "azurerm_client_config" "current" {}
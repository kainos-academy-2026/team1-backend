resource "random_password" "db_admin" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "azurerm_postgresql_flexible_server" "app" {
  name                   = "psql-team1-backend-${var.environment}"
  resource_group_name    = module.resource_group.resource_group_name
  location               = module.resource_group.resource_group_location
  version                = "16"
  administrator_login    = "psqladmin"
  administrator_password = random_password.db_admin.result
  zone                   = "1"
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms"
  tags                   = local.merged_tags
}

resource "azurerm_postgresql_flexible_server_database" "app" {
  name      = "academy_db"
  server_id = azurerm_postgresql_flexible_server.app.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# 0.0.0.0 → 0.0.0.0 is the Azure convention for "allow all Azure-internal traffic"
resource "azurerm_postgresql_flexible_server_firewall_rule" "azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.app.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_key_vault_secret" "database_url" {
  name         = "database-url"
  value        = "postgresql://psqladmin:${random_password.db_admin.result}@${azurerm_postgresql_flexible_server.app.fqdn}:5432/academy_db?sslmode=require"
  key_vault_id = azurerm_key_vault.app.id

  depends_on = [azurerm_role_assignment.kv_secrets_officer]
}

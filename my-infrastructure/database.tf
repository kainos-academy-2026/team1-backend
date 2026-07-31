resource "azurerm_postgresql_flexible_server" "app" {
  name                   = "psql-team1-backend-${var.environment}"
  resource_group_name    = module.resource_group.resource_group_name
  location               = module.resource_group.resource_group_location
  version                = "16"
  administrator_login    = "psqladmin"
  administrator_password = var.db_admin_password
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

removed {
  from = azurerm_key_vault_secret.database_url

  lifecycle {
    destroy = false
  }
}

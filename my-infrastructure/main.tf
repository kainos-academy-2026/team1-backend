module "resource_group" {
  source = "./modules/resource-group"

  name     = local.effective_resource_group_name
  location = var.location
  tags     = merge(local.merged_tags, { environment = var.environment })
}

moved {
  from = azurerm_resource_group.main
  to   = module.resource_group.azurerm_resource_group.this
}

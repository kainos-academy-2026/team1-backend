locals {
  # Allow an override, otherwise build a predictable RG name from project + environment.
  effective_resource_group_name = var.resource_group_name != "" ? var.resource_group_name : "${var.name_prefix}-${var.project_name}-${var.environment}"

  # Merge default tags with user-provided overrides
  merged_tags = merge(var.default_tags, var.tags)
}

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

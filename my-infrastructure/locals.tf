locals {
  # Allow an override, otherwise build a predictable RG name from project + environment.
  effective_resource_group_name = var.resource_group_name != "" ? var.resource_group_name : "${var.name_prefix}-${var.project_name}-${var.environment}"
  
  # Merge default tags with user-provided overrides
  merged_tags = merge(var.default_tags, var.tags)
}

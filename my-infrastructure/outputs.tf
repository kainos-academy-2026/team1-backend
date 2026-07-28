output "resource_group_name" {
  description = "Name of the Azure Resource Group."
  value       = module.resource_group.resource_group_name
}

output "resource_group_id" {
  description = "Full Azure resource ID of the Resource Group."
  value       = module.resource_group.resource_group_id
}

output "resource_group_location" {
  description = "Azure region of the Resource Group."
  value       = module.resource_group.resource_group_location
}

output "resource_group_tags" {
  description = "Tags applied to the Resource Group."
  value       = module.resource_group.resource_group_tags
}
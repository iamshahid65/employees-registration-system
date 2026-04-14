output "acr_id" {
  description = "ACR ka full resource ID"
  value       = azurerm_container_registry.main.id
}

output "acr_login_server" {
  description = "ACR ka login server URL — docker push mein use hoga"
  value       = azurerm_container_registry.main.login_server
}

output "acr_name" {
  description = "ACR ka naam"
  value       = azurerm_container_registry.main.name
}
output "acr_admin_username" {
  description = "ACR admin username"
  value       = azurerm_container_registry.main.admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "ACR admin password"
  value       = azurerm_container_registry.main.admin_password
  sensitive   = true
}
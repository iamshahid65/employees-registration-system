output "mysql_server_fqdn" {
  description = "MySQL Server address"
  value       = azurerm_mysql_flexible_server.main.fqdn
}

output "mysql_database_name" {
  value       = azurerm_mysql_flexible_database.main.name
}

output "mysql_server_name" {
  value       = azurerm_mysql_flexible_server.main.name
}
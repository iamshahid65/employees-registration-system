output "sql_server_fqdn" {
  description = "SQL Server address"
  value       = azurerm_mssql_server.main.fully_qualified_domain_name
}

output "sql_database_name" {
  description = "Database name"
  value       = azurerm_mssql_database.main.name
}

output "sql_server_name" {
  description = "Server name"
  value       = azurerm_mssql_server.main.name
}
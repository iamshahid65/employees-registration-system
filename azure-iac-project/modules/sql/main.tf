# SQL Server
resource "azurerm_mssql_server" "main" {
  name                         = "sql-${var.project_name}-${var.environment}-${var.unique_suffix}"
  resource_group_name          = var.resource_group_name
  location                     = var.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = var.sql_admin_password
  minimum_tls_version          = "1.2"
  tags                         = var.tags
}

# SQL Database
resource "azurerm_mssql_database" "main" {
  name        = "db-${var.project_name}-${var.environment}"
  server_id   = azurerm_mssql_server.main.id
  sku_name    = var.sql_sku
  max_size_gb = var.max_size_gb
  tags        = var.tags
}

# Firewall — Azure Services Allow
resource "azurerm_mssql_firewall_rule" "azure_services" {
  name             = "allow-azure-services"
  server_id        = azurerm_mssql_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
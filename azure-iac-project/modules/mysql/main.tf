resource "azurerm_mysql_flexible_server" "main" {
name = "mysql-${var.project_name}-${var.unique_suffix}"
  resource_group_name    = var.resource_group_name
  location               = var.location
  administrator_login    = var.mysql_admin_username
  administrator_password = var.mysql_admin_password
  sku_name               = var.mysql_sku
  version                = "8.0.21"
  zone                   = "1"
  backup_retention_days  = 7
  tags                   = var.tags
}

resource "azurerm_mysql_flexible_database" "main" {
 name                = var.mysql_database_name 
  resource_group_name = var.resource_group_name
  server_name         = azurerm_mysql_flexible_server.main.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_unicode_ci"
}

# Firewall — Azure Services
resource "azurerm_mysql_flexible_server_firewall_rule" "azure_services" {
  name                = "allow-azure-services"
  resource_group_name = var.resource_group_name
  server_name         = azurerm_mysql_flexible_server.main.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

# Firewall — All (App Service ke liye)
resource "azurerm_mysql_flexible_server_firewall_rule" "allow_all" {
  name                = "allow-app-service"
  resource_group_name = var.resource_group_name
  server_name         = azurerm_mysql_flexible_server.main.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}

# SSL OFF
resource "azurerm_mysql_flexible_server_configuration" "ssl" {
  name                = "require_secure_transport"
  resource_group_name = var.resource_group_name
  server_name         = azurerm_mysql_flexible_server.main.name
  value               = "OFF"
}
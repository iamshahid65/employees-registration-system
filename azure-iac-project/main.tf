resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

module "networking" {
  source              = "./modules/networking"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  project_name        = var.project_name
  environment         = var.environment
  vnet_address_space  = var.vnet_address_space
  subnets             = var.subnets
  tags                = var.tags
  depends_on          = [azurerm_resource_group.main]
}

module "acr" {
  source              = "./modules/acr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  project_name        = var.project_name
  environment         = var.environment
  acr_sku             = var.acr_sku
  tags                = var.tags
}

module "identity" {
  source              = "./modules/identity"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  project_name        = var.project_name
  environment         = var.environment
  acr_id              = module.acr.acr_id
  tags                = var.tags
  depends_on          = [module.acr]
}



module "keyvault" {
  source                = "./modules/keyvault"
  resource_group_name   = azurerm_resource_group.main.name
  location              = azurerm_resource_group.main.location
  project_name          = var.project_name
  environment           = var.environment
  unique_suffix         = var.unique_suffix
  tenant_id             = data.azurerm_key_vault_secret.tenant_id.value          
  terraform_object_id   = data.azurerm_key_vault_secret.terraform_object_id.value
  identity_principal_id = module.identity.identity_principal_id
  sql_admin_username    = var.sql_admin_username
  sql_admin_password    = var.sql_admin_password
  mysql_admin_username  = var.mysql_admin_username
  mysql_admin_password  = var.mysql_admin_password
  acr_login_server      = module.acr.acr_login_server
  tags                  = var.tags
  depends_on            = [module.identity]
}

# MySQL — only when  db_choice = 1
module "mysql" {
  count                = var.db_choice == 1 ? 1 : 0
  source               = "./modules/mysql"
  resource_group_name  = azurerm_resource_group.main.name
  location             = azurerm_resource_group.main.location
  project_name         = var.project_name
  unique_suffix        = var.unique_suffix
  mysql_admin_username = var.mysql_admin_username
  mysql_admin_password = var.mysql_admin_password
  mysql_database_name  = var.mysql_database_name 
  mysql_sku            = var.mysql_sku
  tags                 = var.tags
}

# SQL — only when db_choice = 0
module "sql" {
  count               = var.db_choice == 0 ? 1 : 0
  source              = "./modules/sql"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  project_name        = var.project_name
  environment         = var.environment
  sql_admin_username  = var.sql_admin_username
  sql_admin_password  = var.sql_admin_password
  sql_sku             = var.sql_sku
  unique_suffix       = var.unique_suffix
  tags                = var.tags
}

module "app_service" {
  source               = "./modules/app_service"
  resource_group_name  = azurerm_resource_group.main.name
  location             = azurerm_resource_group.main.location
  project_name         = var.project_name
  environment          = var.environment
  app_service_sku      = var.app_service_sku
  identity_id          = module.identity.identity_id
  identity_client_id   = module.identity.identity_client_id
  acr_login_server     = module.acr.acr_login_server
  acr_admin_username   = var.acr_admin_username
  acr_admin_password   = data.azurerm_key_vault_secret.acr_admin_password.value 
  frontend_image_name  = var.frontend_image_name
  backend_image_name   = var.backend_image_name
  db_choice            = var.db_choice
  mysql_server_fqdn    = var.db_choice == 1 ? module.mysql[0].mysql_server_fqdn : ""
  mysql_database_name  = var.db_choice == 1 ? module.mysql[0].mysql_database_name : ""
  mysql_app_username   = var.mysql_app_username
  mysql_app_password   = data.azurerm_key_vault_secret.mysql_app_password.value   
  sql_server_fqdn      = var.db_choice == 0 ? module.sql[0].sql_server_fqdn : ""
  sql_database_name    = var.db_choice == 0 ? module.sql[0].sql_database_name : ""
  sql_admin_username   = var.sql_admin_username
  sql_admin_password   = var.sql_admin_password
  tags                 = var.tags
  depends_on           = [module.acr, module.mysql, module.sql, module.identity]
}
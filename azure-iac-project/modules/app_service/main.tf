# App Service Plan — dono apps ka ghar
resource "azurerm_service_plan" "main" {
  name                = "asp-${var.project_name}-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = var.app_service_sku
  tags                = var.tags
}

# Frontend App Service — Container Based
resource "azurerm_linux_web_app" "frontend" {
  name                = "app-frontend-${var.project_name}-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.main.id

  # Managed Identity — ACR se pull karne ke liye
  identity {
    type         = "UserAssigned"
    identity_ids = [var.identity_id]
  }

  site_config {
   application_stack {
      docker_image_name   = var.frontend_image_name
      docker_registry_url = "https://${var.acr_login_server}"
    }
  }

  # Environment Variables
app_settings = {
    "WEBSITES_PORT"                       = "3000"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${var.acr_login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = var.acr_admin_username  # ← ADD
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = var.acr_admin_password  # ← ADD
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "acrUseManagedIdentityCreds"          = "false"                 # ← CHANGE
    "REACT_APP_API_URL"                   = "https://app-backend-${var.project_name}-${var.environment}.azurewebsites.net/api"  # ← ADD
  }
  tags = var.tags
}

# Backend App Service — Container Based
resource "azurerm_linux_web_app" "backend" {
  name                = "app-backend-${var.project_name}-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.main.id

  # Managed Identity — ACR se pull karne ke liye
  identity {
    type         = "UserAssigned"
    identity_ids = [var.identity_id]
  }

  site_config {
    application_stack {
docker_image_name = var.backend_image_name
      docker_registry_url      = "https://${var.acr_login_server}"
     
    }
  }
app_settings = {
  "WEBSITES_PORT"                       = "5000"
  "DOCKER_REGISTRY_SERVER_URL"          = "https://${var.acr_login_server}"
  "DOCKER_REGISTRY_SERVER_USERNAME"     = var.acr_admin_username
  "DOCKER_REGISTRY_SERVER_PASSWORD"     = var.acr_admin_password
  "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
  "acrUseManagedIdentityCreds"          = "false"
  "DB_HOST"     = var.db_choice == 1 ? var.mysql_server_fqdn : var.sql_server_fqdn
  "DB_NAME"     = var.db_choice == 1 ? var.mysql_database_name : var.sql_database_name
  "DB_USER"     = var.db_choice == 1 ? var.mysql_app_username : var.sql_admin_username
  "DB_PASSWORD" = var.db_choice == 1 ? var.mysql_app_password : var.sql_admin_password
  "DB_PORT"     = var.db_choice == 1 ? "3306" : "1433"
  "FRONTEND_URL" = "https://app-frontend-${var.project_name}-${var.environment}.azurewebsites.net"  # ← ADD
}
  tags = var.tags
}
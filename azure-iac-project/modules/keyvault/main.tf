# Key Vault
resource "azurerm_key_vault" "main" {
  name                = "kv-${var.environment}-${var.unique_suffix}"
  resource_group_name = var.resource_group_name
  location            = var.location
  tenant_id           = var.tenant_id
  sku_name            = "standard"

  # Soft delete — accidentally delete ho toh 90 days mein recover
  soft_delete_retention_days = 7
  purge_protection_enabled   = false

  # Access Policy — Terraform ko secrets likhne ki permission
  access_policy {
    tenant_id = var.tenant_id
    object_id = var.terraform_object_id

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Purge"
    ]
  }

  # Access Policy — Managed Identity ko secrets padhne ki permission
  access_policy {
    tenant_id = var.tenant_id
    object_id = var.identity_principal_id

    secret_permissions = [
      "Get", "List"
    ]
  }

  tags = var.tags
}

# MySQL Username Secret
resource "azurerm_key_vault_secret" "mysql_username" {
  name         = "mysql-admin-username"
  value        = var.mysql_admin_username
  key_vault_id = azurerm_key_vault.main.id
  depends_on   = [azurerm_key_vault.main]
}

# MySQL Password Secret
resource "azurerm_key_vault_secret" "mysql_password" {
  name         = "mysql-admin-password"
  value        = var.mysql_admin_password
  key_vault_id = azurerm_key_vault.main.id
  depends_on   = [azurerm_key_vault.main]
}

# ACR Login Server Secret
resource "azurerm_key_vault_secret" "acr_login_server" {
  name         = "acr-login-server"
  value        = var.acr_login_server
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault.main]
}
# SQL Username Secret
resource "azurerm_key_vault_secret" "sql_username" {
  name         = "sql-admin-username"
  value        = var.sql_admin_username
  key_vault_id = azurerm_key_vault.main.id
  depends_on   = [azurerm_key_vault.main]
}

# SQL Password Secret
resource "azurerm_key_vault_secret" "sql_password" {
  name         = "sql-admin-password"
  value        = var.sql_admin_password
  key_vault_id = azurerm_key_vault.main.id
  depends_on   = [azurerm_key_vault.main]
}


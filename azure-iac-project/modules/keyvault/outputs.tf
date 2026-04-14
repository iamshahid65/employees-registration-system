output "key_vault_id" {
  description = "Key Vault ID"
  value       = azurerm_key_vault.main.id
}

output "key_vault_uri" {
  value       = azurerm_key_vault.main.vault_uri
}

output "sql_username_secret_id" {
  value       = azurerm_key_vault_secret.sql_username.id
}

output "sql_password_secret_id" {
  value       = azurerm_key_vault_secret.sql_password.id
}
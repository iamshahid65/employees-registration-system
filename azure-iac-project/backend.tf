terraform {
  backend "azurerm" {
    resource_group_name  = "rgremote-terraform-backend"
    storage_account_name = "tfstatemaryam226"
    container_name       = "tfstate"
    key                  = "azure-iac-project.tfstate"
    subscription_id      = "5f0045cc-371f-4958-a339-1a5cccc56285"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85.0"
    }
  }

  required_version = ">= 1.6.0"
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
  subscription_id            = "5f0045cc-371f-4958-a339-1a5cccc56285"
}

# Key Vault Reference
data "azurerm_key_vault" "secrets" {
  name                = "kv-test-maryam22"
  resource_group_name = "RG-Maryam1"
}

# Secrets Read Karo
data "azurerm_key_vault_secret" "mysql_app_password" {
  name         = "mysql-app-password"
  key_vault_id = data.azurerm_key_vault.secrets.id
}

data "azurerm_key_vault_secret" "acr_admin_password" {
  name         = "acr-admin-password"
  key_vault_id = data.azurerm_key_vault.secrets.id
}

data "azurerm_key_vault_secret" "tenant_id" {
  name         = "tenant-id"
  key_vault_id = data.azurerm_key_vault.secrets.id
}

data "azurerm_key_vault_secret" "terraform_object_id" {
  name         = "terraform-object-id"
  key_vault_id = data.azurerm_key_vault.secrets.id
}
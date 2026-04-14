variable "resource_group_name" {
  description = "Main resource group"
  type        = string
  default     = "rg-microservices-testing"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

variable "environment" {
  description = "dev ya prod"
  type        = string
  default     = "test"
}

variable "project_name" {
  description = "Project naam"
  type        = string
  default     = "microservices"
}

variable "tags" {
  type = map(string)
  default = {
    project    = "azure-iac-project"
    managed_by = "terraform"
    team       = "MSS-devops"
  }
}

variable "vnet_address_space" {
  description = "VNet CIDR range"
  type        = string
}

variable "subnets" {

  type = map(object({
    cidr                              = string
    private_endpoint_policies_enabled = bool
  }))
}

variable "acr_sku" {
  description = "ACR tier"
  type        = string
  default     = "Basic"
}

variable "unique_suffix" {
  description = "Globally unique suffix"
  type        = string
  default     = "maryam26"
}

variable "app_service_sku" {
  description = "App Service Plan SKU"
  type        = string
  default     = "B1"
}

variable "frontend_image_name" {
  description = "inside frontend image the name of ACR"
  type        = string
}

variable "frontend_image_tag" {
  description = "Frontend image tag"
  type        = string
  default     = "latest"
}

variable "backend_image_name" {
  description = "inside Backend image the name of ACR "
  type        = string
}

variable "backend_image_tag" {
  description = "Backend image tag"
  type        = string
  default     = "latest"
}

variable "tenant_id" {
  description = "Azure AD Tenant ID"
  type        = string
  sensitive   = true
}

variable "terraform_object_id" {
  description = "Terraform user Object ID"
  type        = string
  sensitive   = true
}

variable "acr_admin_username" {
  description = "ACR admin username"
  type        = string
  sensitive   = true
}

variable "acr_admin_password" {
  description = "ACR admin password"
  type        = string
  sensitive   = true
}

variable "mysql_admin_username" {
  description = "MySQL admin username"
  type        = string
  sensitive   = true
}

variable "mysql_admin_password" {
  description = "MySQL admin password"
  type        = string
  sensitive   = true
}

variable "mysql_sku" {
  description = "MySQL SKU"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "mysql_app_username" {
  description = "MySQL app username"
  type        = string
  sensitive   = true
}

variable "mysql_app_password" {
  description = "MySQL app password"
  type        = string
  sensitive   = true
}

variable "sql_admin_username" {
  description = "SQL admin username"
  type        = string
  default     = ""
  sensitive   = true
}

variable "sql_admin_password" {
  description = "SQL admin password"
  type        = string
  default     = ""
  sensitive   = true
}

variable "sql_sku" {
  description = "SQL Database tier"
  type        = string
  default     = "Basic"
}

variable "db_choice" {
  description = "select one: 1 = MySQL, 0 = Azure SQL"
  type        = number
  

  validation {
    condition     = contains([0, 1], var.db_choice)
    error_message = "1 (MySQL) or  0 (SQL) "
  }
}

variable "mysql_database_name" {
  description = "MySQL database naam"
  type        = string
  default     = "employee_registration"
}
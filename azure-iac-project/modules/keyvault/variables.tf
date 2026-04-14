variable "resource_group_name" {
  description = "Resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "project_name" {
  description = "Project naam"
  type        = string
}

variable "unique_suffix" {
  description = "Globally unique suffix"
  type        = string
}

variable "tenant_id" {
  description = "Azure AD Tenant ID"
  type        = string
  sensitive   = true
}

variable "terraform_object_id" {
  type        = string
  sensitive   = true
}

variable "environment" {
  type = string
}
variable "identity_principal_id" {
  type        = string
}

variable "mysql_admin_username" {
  description = "MySQL username"
  type        = string
  sensitive   = true
}

variable "mysql_admin_password" {
  description = "MySQL password"
  type        = string
  sensitive   = true
}

variable "acr_login_server" {
  type        = string
}


variable "tags" {
  description = "Azure tags"
  type        = map(string)
  default     = {}
}
variable "sql_admin_username" {
  description = "SQL admin username"
  type        = string
  sensitive   = true
}

variable "sql_admin_password" {
  description = "SQL admin password"
  type        = string
  sensitive   = true
}
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
  default     = "Standard_B1ms"
}

variable "tags" {
  description = "Azure tags"
  type        = map(string)
  default     = {}
}
variable "mysql_database_name" {
  type        = string
  default     = "employee_registration"
}

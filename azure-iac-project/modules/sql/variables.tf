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

variable "environment" {
  description = "dev, staging, prod"
  type        = string
}

variable "unique_suffix" {
  description = "Globally unique suffix"
  type        = string
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

variable "sql_sku" {
  description = "SQL Database tier"
  type        = string
  default     = "Basic"
}

variable "max_size_gb" {
  description = "Database max size"
  type        = number
  default     = 2
}

variable "tags" {
  description = "Azure tags"
  type        = map(string)
  default     = {}
}
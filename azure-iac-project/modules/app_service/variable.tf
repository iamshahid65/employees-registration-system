variable "resource_group_name" {
  description = "Resource group"
  type        = string
}

variable "location" {
  type        = string
}

variable "project_name" {
  type        = string
}

variable "environment" {
  description = "dev, staging, prod"
  type        = string
}

variable "app_service_sku" {
  type        = string
  default     = "B1"
}

variable "identity_id" {
  description = "Managed Identity ID — ACR pull "
  type        = string
}

variable "acr_login_server" {
  description = "ACR login server URL"
  type        = string
}

variable "frontend_image_name" {
  type        = string
}

variable "frontend_image_tag" {
  description = "Frontend image tag"
  type        = string
  default     = "latest"
}

variable "backend_image_name" {
  description = "Backend Docker image name"
  type        = string
}

variable "backend_image_tag" {
  description = "Backend image tag"
  type        = string
  default     = "latest"
}

variable "tags" {
  description = "Azure tags"
  type        = map(string)
  default     = {}
}
variable "identity_client_id" {
  type        = string
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
variable "mysql_server_fqdn" {
  description = "MySQL Server address"
  type        = string
}

variable "mysql_database_name" {
  description = "MySQL Database naam"
  type        = string
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
variable "db_choice" {
  description = "1 = MySQL, 0 = SQL"
  type        = number
  default     = 1
}

variable "sql_server_fqdn" {
  description = "SQL Server address"
  type        = string
  default     = ""
}

variable "sql_database_name" {
  description = "SQL Database naam"
  type        = string
  default     = ""
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

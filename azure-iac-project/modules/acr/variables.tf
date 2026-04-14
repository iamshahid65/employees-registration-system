variable "resource_group_name" {
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "project_name" {
  description = "Project ka naam — ACR name mein use hoga"
  type        = string
}

variable "environment" {
  description = "Environment — dev, staging, prod"
  type        = string
}

variable "acr_sku" {
  description = "ACR ka tier — Basic, Standard, Premium"
  type        = string
  default     = "Basic"

  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.acr_sku)
    error_message = "ACR SKU sirf Basic, Standard, ya Premium ho sakta hai!"
  }
}

variable "tags" {
  description = "Azure resource tags"
  type        = map(string)
  default     = {}
}

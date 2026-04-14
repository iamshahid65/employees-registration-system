variable "resource_group_name" {
  description = "Resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "project_name" {
  type        = string
}

variable "environment" {
  description = "dev, staging, prod"
  type        = string
}

variable "acr_id" {
  type        = string
}

variable "tags" {
  description = "Azure tags"
  type        = map(string)
  default     = {}
}


variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vnet_address_space" {
  type = string
}

variable "subnets" {
  type = map(object({
    cidr                              = string
    private_endpoint_policies_enabled = bool
  }))
}

# variable "bastion_subnet_cidr" {
#   type = string
# }

variable "tags" {
  type = map(string)
}
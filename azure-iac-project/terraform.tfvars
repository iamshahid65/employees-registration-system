resource_group_name = "RG-Maryam1"
location            = "southeastasia"


# Networking values
vnet_address_space  = "10.0.0.0/16"

subnets = {
  "gateway-subnet" = {
    cidr                              = "10.0.1.0/24"
    private_endpoint_policies_enabled = true
  }
  "aks-subnet" = {
    cidr                              = "10.0.2.0/24"
    private_endpoint_policies_enabled = false
  }
  "data-subnet" = {
    cidr                              = "10.0.3.0/24"
    private_endpoint_policies_enabled = false
  }
  "mgmt-subnet" = {
    cidr                              = "10.0.5.0/24"
    private_endpoint_policies_enabled = false
  }
}

acr_sku = "Basic"

tags = {
  project     = "azure-iac-project"
  environment = "dev"
  managed_by  = "terraform"
  team        = "devops"
}


mysql_app_username = "employee_user"
mysql_sku = "B_Standard_B1ms"
unique_suffix = "maryam22"
mysql_database_name = "employee_registration"
# db_choice = 1   # 1 = MySQL, 0 = SQL


app_service_sku     = "B1"
frontend_image_tag  = "latest"
backend_image_tag   = "latest"
frontend_image_name = "employees-registration-system-frontend"
backend_image_name  = "employees-registration-system-backend"


acr_admin_username = "acrmicroservicestest"

tenant_id           = "def44f5f-0783-4b05-8f2f-dd615c5dfec4"
terraform_object_id = "334c5af9-2739-48c3-9908-a6fc3026b91a"

# mysql_admin_username = "mysqladmin"
# mysql_admin_password = P@ssw0rd1234!


  # acradmin = 3740fc6c47e04e57b5d526147a0665d5
  # mysql_app_password = StrongPassword123!

 
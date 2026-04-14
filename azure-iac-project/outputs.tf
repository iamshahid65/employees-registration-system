output "frontend_url" {
  description = "Frontend App Service URL"
  value       = module.app_service.frontend_url
}

output "backend_url" {
  description = "Backend App Service URL"
  value       = module.app_service.backend_url
}

output "acr_login_server" {
  value       = module.acr.acr_login_server
}
output "mysql_server_fqdn" {
  description = "MySQL Server Address"
  value       = var.db_choice == 1 ? module.mysql[0].mysql_server_fqdn : ""
}
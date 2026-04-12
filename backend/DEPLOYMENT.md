# Deployment Guide - Employee Registration System Backend

## Prerequisites

- Azure subscription
- Azure CLI installed
- Docker (optional for local testing)
- Git

## Option 1: Deploy to Azure App Service with Docker

### Step 1: Create Azure Resources

```bash
# Set variables
RESOURCE_GROUP="rg-employees"
APP_NAME="employees-backend"
SQL_SERVER="employees-sql-server"
LOCATION="eastus"

# Create resource group
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Create Azure SQL Server
az sql server create \
  --name $SQL_SERVER \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --admin-user sqladmin \
  --admin-password "YourSecurePassword123!"

# Create Azure SQL Database
az sql db create \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER \
  --name employees_db \
  --edition Basic

# Configure firewall to allow Azure services
az sql server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER \
  --name "AllowAzureServices" \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Step 2: Create Container Registry

```bash
# Create Azure Container Registry
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name employeesregistry \
  --sku Basic

# Get login credentials
az acr credential show \
  --name employeesregistry \
  --query "[username,passwords[0].value]" \
  --output tsv
```

### Step 3: Build and Push Docker Image

```bash
# Build Docker image
docker build -t employeesregistry.azurecr.io/employees-backend:latest ./backend

# Login to ACR
az acr login --name employeesregistry

# Push image
docker push employeesregistry.azurecr.io/employees-backend:latest
```

### Step 4: Create App Service Plan and Web App

```bash
# Create App Service Plan
az appservice plan create \
  --name app-plan-employees \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan app-plan-employees \
  --name $APP_NAME \
  --deployment-container-image-name employeesregistry.azurecr.io/employees-backend:latest

# Enable managed identity for App Service
az webapp identity assign \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME

# Configure Web App to use ACR
PRINCIPAL_ID=$(az webapp identity show \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --query principalId \
  --output tsv)

az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role acrpull \
  --scope /subscriptions/{subscription-id}/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/employeesregistry
```

### Step 5: Configure Application Settings

```bash
# Get SQL Server FQDN
SQL_HOST=$(az sql server show \
  --resource-group $RESOURCE_GROUP \
  --name $SQL_SERVER \
  --query fullyQualifiedDomainName \
  --output tsv)

# Set environment variables in App Service
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    NODE_ENV=production \
    DB_HOST=$SQL_HOST \
    DB_PORT=1433 \
    DB_USER=sqladmin \
    DB_PASSWORD="YourSecurePassword123!" \
    DB_NAME=employees_db \
    FRONTEND_URL=https://your-frontend-domain.com \
    PORT=5000

# Configure continuous deployment
az webapp deployment container config \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --enable-cd true
```

## Option 2: Deploy Using GitHub Actions

### Step 1: Create Secrets in GitHub

Go to repository Settings → Secrets and add:
- `AZURE_CREDENTIALS` - Output from `az ad sp create-for-rbac`
- `REGISTRY_USERNAME` - ACR username
- `REGISTRY_PASSWORD` - ACR password
- `REGISTRY_LOGIN_SERVER` - ACR login server

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to Azure

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Azure Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.REGISTRY_LOGIN_SERVER }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.REGISTRY_LOGIN_SERVER }}/employees-backend:latest
            ${{ secrets.REGISTRY_LOGIN_SERVER }}/employees-backend:${{ github.sha }}
      
      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: employees-backend
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          images: |
            ${{ secrets.REGISTRY_LOGIN_SERVER }}/employees-backend:latest
```

## Option 3: Deploy with Azure CLI (Direct)

```bash
# Create deployment package
zip -r deployment.zip backend/ -x "backend/node_modules/*" "backend/.env"

# Deploy
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src deployment.zip

# Enable Node runtime
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings WEBSITE_NODE_DEFAULT_VERSION=20.x
```

## Verification

### Check Deployment Status

```bash
# Get deployment logs
az webapp log tail \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP

# Test health endpoint
curl https://$APP_NAME.azurewebsites.net/health
```

### Connect to Azure SQL Database

```bash
# Using Azure CLI
az sql db query \
  --database employees_db \
  --server $SQL_SERVER \
  --username sqladmin \
  --password "YourSecurePassword123!" \
  --query-text "SELECT COUNT(*) as employee_count FROM employees"
```

## Security Best Practices

1. **Use Managed Identity**: Replace connection strings with managed identity
2. **Enable SSL/TLS**: Always use HTTPS for App Service
3. **Firewall Rules**: Restrict database access to App Service only
4. **Key Vault**: Store sensitive data in Azure Key Vault
5. **Monitoring**: Enable Application Insights for monitoring

### Enable Application Insights

```bash
az monitor app-insights component create \
  --app employees-backend \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP

# Link to App Service
APP_INSIGHTS_KEY=$(az monitor app-insights component show \
  --resource-group $RESOURCE_GROUP \
  --app employees-backend \
  --query instrumentationKey \
  --output tsv)

az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$APP_INSIGHTS_KEY
```

## Scaling

```bash
# Scale App Service Plan
az appservice plan update \
  --name app-plan-employees \
  --resource-group $RESOURCE_GROUP \
  --sku S1

# Enable auto-scaling
az monitor autoscale create \
  --resource-group $RESOURCE_GROUP \
  --resource app-plan-employees \
  --resource-type "Microsoft.Web/serverfarms" \
  --name autoscale-employees \
  --min-count 1 \
  --max-count 5 \
  --count 2
```

## Troubleshooting

### Connection Timeout
- Check firewall rules in Azure SQL
- Verify DB credentials in App Service settings
- Enable Azure services in SQL Server firewall

### Application Crashes
- Check Application Insights logs
- Review App Service logs: `az webapp log tail`
- Verify NODE_ENV is set to `production`

### Database Issues
- Restart App Service
- Check database size limits (Basic plan has 2GB limit)
- Monitor DTU usage in Azure Portal

## Cleanup

```bash
# Delete resource group (deletes all resources)
az group delete --name $RESOURCE_GROUP
```

## Support

For issues or questions:
1. Check Azure App Service logs
2. Review Application Insights monitoring
3. Consult Azure SQL documentation
4. Check Node.js and mssql package documentation

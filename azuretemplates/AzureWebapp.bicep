
@description('The name of the web application.')
param name string

@description('The location/region where the resources will be deployed. (e.g., eastus, westus). Default is the resource group location.')
param location string = resourceGroup().location

@description('Indicates whether to use an existing App Service Plan.')
@allowed([true, false])
param useExistingAppServicePlan bool = true

@description('The name of the App Service Plan to use or create.')
@minLength(1)
param appServicePlanName string

@description('The resource group of the existing App Service Plan, if applicable.')
@minLength(1)
param appServicePlanResourceGroup string


@description('Username for server admin account and also to access the application admin tools')
param adminUsername string

@description('Password for server admin account and also to access the application admin tools')
@secure()
param adminPassword string


var serverFarmResourceId = useExistingAppServicePlan
  ? resourceId(appServicePlanResourceGroup, 'Microsoft.Web/serverfarms', appServicePlanName)
  : appServicePlan.id

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = if (!useExistingAppServicePlan) {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
    size: 'B1'
    family: 'B'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    perSiteScaling: false
    elasticScaleEnabled: false
    maximumElasticWorkerCount: 1
    isSpot: false
    reserved: true
    isXenon: false
    hyperV: false
    targetWorkerCount: 0
    targetWorkerSizeId: 0
    zoneRedundant: false
  }
}

resource name_resource 'Microsoft.Web/sites@2022-03-01' = {
  name: name
  location: location
  tags: {}
  properties: {
    name: name
    siteConfig: {
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'HTTPPORT'
          value: '8080'
        }
        {
          name: 'USER'
          value: adminUsername
        }
        {
          name: 'PASSWORD'
          value: adminPassword
        }
      ]
      linuxFxVersion: 'sitecontainers'
      alwaysOn: false
      ftpsState: 'FtpsOnly'
    }
    serverFarmId: serverFarmResourceId
    clientAffinityEnabled: false
    virtualNetworkSubnetId: null
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
  }
  dependsOn: [
    // Only depend on appServicePlan if creating a new one
    useExistingAppServicePlan ? null : appServicePlan
  ]
}

resource name_scm 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2022-09-01' = {
  parent: name_resource
  name: 'scm'
  properties: {
    allow: false
  }
}

resource name_ftp 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2022-09-01' = {
  parent: name_resource
  name: 'ftp'
  properties: {
    allow: false
  }
}

resource name_siteContainer 'Microsoft.Web/sites/sitecontainers@2021-02-01' = {
  parent: name_resource
  name: 'main'
  properties: {
    image: 'proxylab.azurecr.io/proxylab:latest'
    targetPort: '8080'
    isMain: true
    startUpCommand: ''
    authType: 'Anonymous'
    userManagedIdentityClientId: null
    userName: null
    passwordSecret: null
  }
}

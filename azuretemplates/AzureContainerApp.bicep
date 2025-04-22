param location string
param containerAppName string
param username string
@secure()
param password string


resource managedEnvironment 'Microsoft.App/managedEnvironments@2024-10-02-preview' = {
  name: 'env-${containerAppName}'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    appLogsConfiguration: {
      destination: 'azure-monitor'
    }
    zoneRedundant: false
    kedaConfiguration: {}
    daprConfiguration: {}
    customDomainConfiguration: {}
    workloadProfiles: [
      {
        workloadProfileType: 'Consumption'
        name: 'Consumption'
        enableFips: false
      }
    ]
    peerAuthentication: {
      mtls: {
        enabled: false
      }
    }
    peerTrafficConfiguration: {
      encryption: {
        enabled: false
      }
    }
    publicNetworkAccess: 'Enabled'
  }
}

resource containerApp 'Microsoft.App/containerapps@2024-10-02-preview' = {
  name: containerAppName
  location: location
  kind: 'containerapps'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: managedEnvironment.id
    workloadProfileName: 'Consumption'
    configuration: {
      secrets: [
        {
          name: 'password'
          value: password
        }
      ]
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 80
        exposedPort: 0
        transport: 'Auto'
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
        allowInsecure: true
        clientCertificateMode: 'Ignore'
        stickySessions: {
          affinity: 'none'
        }
      }
      identitySettings: []
      maxInactiveRevisions: 100
    }
    template: {
      containers: [
        {
          image: 'proxylab.azurecr.io/proxylab:v0.0.2-test'
          imageType: 'ContainerImage'
          name: containerAppName
          env: [
            {
              name: 'HTTPPORT'
              value: '80'
            }
            {
              name: 'HTTPSPORT'
              value: '443'
            }
            {
              name: 'USER'
              value: username
            }
            {
              name: 'PASSWORD'
              secretRef: 'password'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          probes: []
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
        cooldownPeriod: 300
        pollingInterval: 30
      }
      volumes: []
    }
  }
}

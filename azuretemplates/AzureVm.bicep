param virtualMachineName string
param httpPort string = '8080'
param httpsPort string = '8443'

@description('Location for all resources.')
param location string = resourceGroup().location

@description('Size of the virtual machine.')
param vmSize string = 'Standard_B8ls_v2'

@description('Deploy VM to an existing VNet? If false, a new VNet and subnet will be created.')
param useExistingVNet bool

@description('Name of the existing virtual network (required if useExistingVNet is true).')
param virtualNetworkName string

@description('Name of the existing subnet (required if useExistingVNet is true).')
param subnetName string

@description('Name of the new virtual network (used if useExistingVNet is false).')
param newVirtualNetworkName string = 'vnet-proxylab'

@description('Name of the new subnet (used if useExistingVNet is false).')
param newSubnetName string = 'snet-application'

@description('Address prefix for the new virtual network (used if useExistingVNet is false).')
param newVnetAddressPrefix string = '10.0.0.0/16'

@description('Address prefix for the new subnet (used if useExistingVNet is false).')
param newSubnetPrefix string = '10.0.1.0/24'

@description('Version of proxylab to deploy')
param appVersion string = 'v0.0.2-test'

@description('Username for server admin account and also to access the application admin tools')
param adminUsername string

@description('Password for server admin account and also to access the application admin tools')
@secure()
param adminPassword string



resource vnet 'Microsoft.Network/virtualNetworks@2021-05-01' = if (!useExistingVNet) {
  name: newVirtualNetworkName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        newVnetAddressPrefix
      ]
    }
    subnets: [
      {
        name: newSubnetName
        properties: {
          addressPrefix: newSubnetPrefix
        }
      }
    ]
  }
}

// Choose VNet and subnet names/IDs based on useExistingVNet
var effectiveVnetName = useExistingVNet ? virtualNetworkName : newVirtualNetworkName
var effectiveSubnetName = useExistingVNet ? subnetName : newSubnetName
var subnetResourceId = resourceId('Microsoft.Network/virtualNetworks/subnets', effectiveVnetName, effectiveSubnetName)

resource virtualMachine 'Microsoft.Compute/virtualMachines@2021-11-01' = {
  name: virtualMachineName
  location: location
  properties: {
    hardwareProfile: {
      vmSize: vmSize
    }
    storageProfile: {
      imageReference: {
        publisher: 'canonical'
        offer: '0001-com-ubuntu-server-jammy'
        sku: '22_04-lts-gen2'
        version: 'latest'
      }
      osDisk: {
        createOption: 'FromImage'
        managedDisk: {
          storageAccountType: 'StandardSSD_LRS'
        }
        diskSizeGB: 127
        deleteOption: 'Delete'
      }
    }
    osProfile: {
      computerName: virtualMachineName
      adminUsername: adminUsername
      adminPassword: adminPassword
      linuxConfiguration: {
        patchSettings: {
          assessmentMode: 'ImageDefault'
          patchMode: 'AutomaticByPlatform'

        }
      }
    }
    securityProfile: {
      securityType: 'TrustedLaunch'
      uefiSettings: {
        secureBootEnabled: true
        vTpmEnabled: true
      }
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: networkInterface.id
          properties: {
            deleteOption: 'Delete'
          }
        }
      ]
    }
  }
}

resource networkInterface 'Microsoft.Network/networkInterfaces@2021-05-01' = {
  name: '${virtualMachineName}-nic'
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig'
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          publicIPAddress: {
            id: publicIPAddress.id
            properties: {
              deleteOption: 'Delete'
            }
          }
          subnet: {
            id: subnetResourceId
          }
          primary: true
          privateIPAddressVersion: 'IPv4'
        }
      }
    ]
    enableAcceleratedNetworking: false
    enableIPForwarding: false
  }
}

resource publicIPAddress 'Microsoft.Network/publicIPAddresses@2021-05-01' = {
  name: '${virtualMachineName}-ip'
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAddressVersion: 'IPv4'
    publicIPAllocationMethod: 'Static'
    idleTimeoutInMinutes: 4
  }
}

resource installDocker 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  parent: virtualMachine
  name: 'installDocker'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Extensions'
    type: 'CustomScript'
    typeHandlerVersion: '2.1'
    autoUpgradeMinorVersion: true
    settings: {
      fileUris: []
      commandToExecute: 'bash -c "curl -fsSL https://get.docker.com | sh && systemctl enable docker && systemctl start docker && docker run --restart unless-stopped -d -p ${httpPort}:${httpPort} -p ${httpsPort}:${httpsPort} -e HTTPPORT=${httpPort} -e HTTPSPORT=${httpsPort} -e USER=${adminUsername} -e PASSWORD=${adminPassword} -e USE_KEYVAULT=false proxylab.azurecr.io/proxylab:${appVersion}"'
    }
  }
}

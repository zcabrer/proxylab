# ProxyLab

ProxyLab is a versatile tool designed for testing and debugging HTTP/HTTPS requests and responses. It includes features such as request/response headers inspection, WAF testing, file uploads, TLS configuration, and more.

## Features

- Request/response header inspection
- Header injection
- Form for request body submission (POST)
- File uploads and downloads
- Query string manipulation
- Timeout testing
- Custom HTTP status code responses
- Packet capture tool
- Live request/response log streaming
- Admin login to protect configuration sections
- TLS support with `.pfx` certificates
- WebSockets

## Deployments

### Azure Deployments

### Deploy to Azure Linux VM

Use the following button to deploy the application to an Azure Ubuntu Linux VM. The app runs inside the VM as a docker container. [Detailed deployment guide](https://github.com/zcabrer/proxylab/wiki/Deployment-Guides#azure-linux-vm).

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fzcabrer%2Fproxylab%2Frefs%2Fheads%2Fmain%2Fazuretemplates%2FAzureVm.json)

### Deploy to Azure Container Instance

You can use the following button to deploy the container to an Azure Container Instance with a single click. [Detailed deployment guide](https://github.com/zcabrer/proxylab/wiki/Deployment-Guides#azure-container-instance-aci).

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fzcabrer%2Fproxylab%2Frefs%2Fheads%2Fmain%2Fazuretemplates%2FAzureContainerInstance.json)

### Deploy to Azure Kubernetes Service (AKS)

Follow the [detailed deployment guide](https://github.com/zcabrer/proxylab/wiki/Deployment-Guides#azure-kubernetes-service-aks), which leverages sample .yaml deployment manifests.

[HTTP sample .yaml](https://raw.githubusercontent.com/zcabrer/proxylab/refs/heads/main/azuretemplates/manifest-http.yaml)

[HTTPS sample .yaml](https://raw.githubusercontent.com/zcabrer/proxylab/refs/heads/main/azuretemplates/manifest-https.yaml)


### Deploy to Azure App Service (for Containers)

You can use the following button to deploy the container to an Azure App Service for Containers with a single click. [Detailed deployment guide](https://github.com/zcabrer/proxylab/wiki/Deployment-Guides#azure-app-service).

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fzcabrer%2Fproxylab%2Frefs%2Fheads%2Fmain%2Fazuretemplates%2FAzureWebapp.json)

### Local Deployment

(Prerequisite: Docker installed on your machine)
[Detailed deployment guide](https://github.com/zcabrer/proxylab/wiki/Deployment-Guides#local-docker-deployment)

1. Clone the repository to your machine.
2. Rename the ```.env.example``` file to ```.env``` and update the environment variables within
3. Build the Docker image:

   ```bash
   docker build -t proxylab .
   ```

4. Run the container. The -p flag denotes the localport:containerport. Local port is the port you will use when browsing to the app (localhost:8080) and containerport should match the port specified in the .env file.

   ```bash
   docker run -p 8080:8080 --env-file .env proxylab
   ```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License.

## Notes

- For detailed instructions on setting up the tools, refer to the [GitHub Wiki](https://github.com/zcabrer/proxylab/wiki).

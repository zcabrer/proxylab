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

### Local Deployment

(Prerequisite: Docker installed on your machine)

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

### Azure Deployments

### Deploy to Azure Linux VM

Use the following button to deploy the application to an Azure Ubuntu Linux VM. The app runs inside the VM as a docker container.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fzcabrer%2Fproxylab%2Frefs%2Fheads%2Fdev%2Fazuretemplates%2FAzureVM.json)

### Deploy to Azure Container Instance(ACI)

You can use the following button to deploy the container to an Azure Container Instance (ACI) with a single click:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fzcabrer%2Fproxylab%2Frefs%2Fheads%2Fdev%2Fazuretemplates%2FAzureContainerInstance.json)

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License.

## Notes

- For detailed instructions on setting up the tools, refer to the [GitHub Wiki](https://github.com/<your-repo>/wiki).

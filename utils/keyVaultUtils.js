const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

async function getCertificateFromKeyVault() {
    const keyVaultName = process.env.KEYVAULT_NAME;
    const certificateName = process.env.KEYVAULT_CERTIFICATE_NAME;
  
    if (!keyVaultName || !certificateName) {
      throw new Error('KeyVault name or certificate name is not specified in environment variables.');
    }
  
    const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUrl, credential);
  
    console.log(`Fetching certificate '${certificateName}' from Azure Key Vault...`);
    const certificateSecret = await secretClient.getSecret(certificateName);
  
    // The secret value contains the PFX certificate
    const pfx = Buffer.from(certificateSecret.value, 'base64');
  
    return {
      pfx: pfx
    };
  }
module.exports = { getCertificateFromKeyVault };
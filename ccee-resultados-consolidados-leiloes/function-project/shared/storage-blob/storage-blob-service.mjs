import { BlobServiceClient } from '@azure/storage-blob';

export default class StorageBlobService{
    #account;
    #sasToken;
    #container;
    #contextFunction;

    constructor(account, sasToken, container, contextFunction){
        this.#account = account;
        this.#sasToken = sasToken;
        this.#container = container;
        this.#contextFunction = contextFunction;
    }

    async uploadToBlobStorage(file, fileName, containerName) {
        try{
            const blobServiceClient = this.#createBlobServiceSasToken();
        
            const containerClient = blobServiceClient.getContainerClient(containerName);

            const blockBlobClient = containerClient.getBlockBlobClient(fileName);

            this.#contextFunction.log('Starting file upload:', fileName);
            await blockBlobClient.uploadData(file);
            this.#contextFunction.log('File upload successful:', fileName);
        }catch(error){
            throw error;
        }
    }
    
    #createBlobServiceSasToken(){
        try{
            const url = `https://${this.#account}.blob.core.windows.net${this.#container}?${this.#sasToken}`;
            return new BlobServiceClient(url);
        }catch(error){
            throw error;
        }
    }
}
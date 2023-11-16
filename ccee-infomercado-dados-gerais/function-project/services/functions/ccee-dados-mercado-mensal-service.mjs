import FileDownload from '../../shared/file-download-upload/file-download-upload.mjs';
import BrowserService from '../utils/browser-service.mjs';
import CCEEDadosMercadoMensalPage from '../../pages/ccee/dados-mercado-mensal-page.mjs';
import StorageBlobService from '../../shared/storage-blob/storage-blob-service.mjs';

export default class CCEEDadosMercadoMensalService{
    #blobStorage;
    #account = process.env['AZURE_STORAGE_ACCOUNT_NAME'];
    #sasToken = process.env['AZURE_STORAGE_SASTOKEN_DATALAKE'];
    #container = process.env['AZURE_STORAGE_SASTOKEN_PATH'];

    #functionContext;
    #fileDownload;
    #browserService;

    constructor(functionContext){
        this.#functionContext = functionContext;
        this.#fileDownload = new FileDownload(functionContext);
        this.#browserService = new BrowserService();
        this.#blobStorage = new StorageBlobService(this.#account, this.#sasToken, this.#container, this.#functionContext);
    }

    async startProcess(){
        await this.#configBrowser();
        const page = await this.#configPage();

        const dadosMercadoMensalPage = new CCEEDadosMercadoMensalPage(page, this.#functionContext);

        await dadosMercadoMensalPage.open();

        const downloadUrl = await dadosMercadoMensalPage.getUrlDownloadDadosMercadoMensal();

        await this.#browserService.closeBrowser();

        const file = await this.#fileDownload.getFile(downloadUrl);

        await this.#uploadFile(file.fileBuffer, file.fileName);
    }
            
    async #configBrowser(){
        await this.#browserService.createNewBrowser({ headless: true });
    }

    async #configPage(){
        return await this.#browserService.createNewPage({ 
            width: 1920, 
            height: 1080,
            downloadBehavior: 'deny'
        });
    }

    async #uploadFile(buffer, fileName){
        const containerName = process.env['CCEE_DADOS_GERAIS_CONTAINER'];

        await this.#blobStorage.uploadToBlobStorage(buffer, fileName, containerName)
        .catch(error => { throw error; });
    }
}
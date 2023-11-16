import FileDownload from '../../shared/file-download-upload/file-download-upload.mjs';
import BrowserService from '../utils/browser-service.mjs';
import CCEEResultadoLeiloesPage from '../../pages/ccee/acervo/resultado-leiloes-page.mjs';
import StorageBlobService from '../../shared/storage-blob/storage-blob-service.mjs';

export default class CCEEResultadoLeiloesService{
    #browserService;
    #context;
    #fileDownload;
    #blobStorage;
    #account = process.env['AZURE_STORAGE_ACCOUNT_NAME'];
    #sasToken = process.env['AZURE_STORAGE_SASTOKEN_DATALAKE'];
    #container = process.env['AZURE_STORAGE_SASTOKEN_PATH'];

    constructor(context){
        this.#context = context;
        this.#fileDownload = new FileDownload(context);
        this.#browserService = new BrowserService();
        this.#blobStorage = new StorageBlobService(this.#account, this.#sasToken, this.#container, this.#context);

    }

    async startProcess(){
        try{

            await this.#configBrowser();
            const page = await this.#configPage();

            const resultadoLeiloesPage = new CCEEResultadoLeiloesPage(page, this.#context);

            await resultadoLeiloesPage.open();

            const downloadUrl = await resultadoLeiloesPage.getUrlDownloadResultadosLeiloes();

            await this.#browserService.closeBrowser();

            const file = await  this.#fileDownload.getFile(downloadUrl);

            await this.#uploadFile(file.fileBuffer, file.fileName);

            return;

        }catch(error){

            this.#browserService.closeBrowser();
            
            throw error;

        }
    }

    async #uploadFile(buffer, fileName){
        const containerName = process.env['CCEE_RESULTADO_CONSOLIDADO_CONTAINER'];

        await this.#blobStorage.uploadToBlobStorage(buffer, fileName, containerName)
        .catch(error => { throw error; });
    }
    
    async #configBrowser(){
        await this.#browserService.createNewBrowser({ headless:true });
    }

    async #configPage(){
        return await this.#browserService.createNewPage({ 
            width: 1920, 
            height: 1080,
            downloadBehavior: 'deny'
        });
    }
}
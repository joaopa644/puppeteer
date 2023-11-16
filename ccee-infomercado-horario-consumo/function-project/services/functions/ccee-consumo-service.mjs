import FileDownload from '../../shared/file-download-upload/file-download-upload.mjs';
import CCEEConsumoPage from '../../pages/ccee/dados-analises/consumo-page.mjs';
import BrowserService from '../utils/browser-service.mjs';
import StorageBlobService from  '../../shared/storage-blob/storage-blob-service.mjs';


export default class CCEEConsumoService{
    #browserService;
    #context;
    #fileDownload;
    #blobStorage;
    #account = process.env['AZURE_STORAGE_ACCOUNT_NAME'];
    #sasToken = process.env['AZURE_STORAGE_SASTOKEN_DATALAKE'];
    #container = process.env['AZURE_STORAGE_SASTOKEN_PATH'];

    constructor(context){
        this.#browserService = new BrowserService();
        this.#context = context;
        this.#fileDownload = new FileDownload(context);
        this.#blobStorage = new StorageBlobService(this.#account, this.#sasToken, this.#container, this.#context);
    }

    async startProcess(currentMonthYear){
        try{
            
            await this.#configBrowser();
            const page = await this.#configPage();

            const consumoPage = new CCEEConsumoPage(page, this.#context);

            await consumoPage.open();

            const downloadUrl = await consumoPage.getUrlDownloadDadosAnalise(currentMonthYear);

            this.#browserService.closeBrowser();

            const file = await  this.#fileDownload.getFile(downloadUrl);

            await this.#uploadFile(file.fileBuffer, file.fileName);

            return;

        }catch(error){

            throw error;

        }  
    }

    async #uploadFile(buffer, fileName){
        const containerName = process.env['CCEE_HORARIO_CONSUMO_CONTAINER'];

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
            
    getCurrentMonthYearDadosAnalise(){
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const currentYear = this.#calculateDate(month, year);
        return `${currentYear.month}/${currentYear.year}`;
    }

    #calculateDate(month, year){
        let date;
        if(month <= 2) {
            date = { month: (month + 12) - 2, year: year - 1};
        }else{
            date = { month: month - 2, year: year};
        }

        if(date.month < 10)
            date.month = `0${date.month}`;

        return date;
    }
}
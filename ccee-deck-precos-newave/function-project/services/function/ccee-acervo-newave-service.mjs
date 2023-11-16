import BrowserService from '../utils/browser-service.mjs'
import CCEEAcervoNewavePage from '../../pages/ccee/acervo/newave-page.mjs'
import DateService from '../utils/date-service.mjs';
import FileDownload from '../../shared/file-download-upload/file-download-upload.mjs';
import StorageBlobService from '../../shared/storage-blob/storage-blob-service.mjs';

export default class CCEEAcervoNewaveService{
    #browserService;
    #context;
    #dateService;
    #fileDownload;
    #blobStorage;
    #account = process.env['AZURE_STORAGE_ACCOUNT_NAME'];
    #sasToken = process.env['AZURE_STORAGE_SASTOKEN_DATALAKE'];
    #container = process.env['AZURE_STORAGE_SASTOKEN_PATH'];

    constructor(context){
        this.#context = context;
        this.#fileDownload = new FileDownload(context);
        this.#browserService = new BrowserService();
        this.#dateService = new DateService();

        this.#blobStorage = new StorageBlobService(this.#account, this.#sasToken, this.#container, context);
    }

    async startProcess(reference){
        try{
            
            await this.#configBrowser();
            const page = await this.#configPage();

            const newavePage = new CCEEAcervoNewavePage(page, this.#context);

            await newavePage.open();

            const downloadUrl = [await newavePage.getUrlDownloadDeckPrecosNewave(reference)];

            this.#browserService.closeBrowser();

            const file = await this.#fileDownload.getFile(downloadUrl);

            await this.#uploadFile(file.fileBuffer, file.fileName);

            return;

        }catch(error){

            throw error;

        }        
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

    calculateNewaveRunDate(currentDate){
        const currentDatePlusSevenDays =  this.#dateService.addSevenDaysToDate(this.#dateService.createNewDate(currentDate));
    
        if(!this.#dateService.itsFriday(currentDate)){
            const lastFriday = this.#dateService.findLastFriday(this.#dateService.createNewDate(currentDate));
    
            if(this.#dateService.areTheDatesInTheSameMonth(currentDate, lastFriday)){
                return this.#dateService.monthYearFormat(currentDate, true);
            }else{
                return this.#dateService.monthYearFormat(currentDate, false);
            }
        }else if(!this.#dateService.areTheDatesInTheSameMonth(currentDate, currentDatePlusSevenDays)){
            return this.#dateService.monthYearFormat(currentDate, true);
    
        }else if(this.#dateService.areTheDatesInTheSameMonth(currentDate, currentDatePlusSevenDays)){
            return null;
    
        }
    }

    async #uploadFile(buffer, fileName){
        const containerName = process.env['CCEE_NEWAVE_CONTAINER'];

        await this.#blobStorage.uploadToBlobStorage(buffer, fileName, containerName)
        .catch(error => { throw error; });
    }
}
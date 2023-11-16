import puppeteer from 'puppeteer'

export default class BrowserService{
    #browser;

    async createNewBrowser(options){
        this.#browser = await puppeteer.launch({
            headless: options.headless
        });

        return this.#browser;
    }

    async createNewPage(options){
        const newPage = await this.#browser.newPage();
        await newPage.setViewport({ 'width': options.width, 'height': options.height});
        await newPage._client.send('Page.setDownloadBehavior', {behavior: options.downloadBehavior});
        
        return newPage;
    }

    async closeBrowser(){
        await this.#browser.close();
    }

    async closePage(page){
        await page.close();
    }
}
import NavigableObject from '../../navigable-object.mjs';
import SimilarityService from '../../../services/utils/similarity-service.mjs';

export default class CCEEConsumoPage extends NavigableObject{
    #URL_CONSUMO = 'https://www.ccee.org.br/web/guest/dados-e-analises/consumo';
    #CARDS_SELECTOR = 'class="card d-flex flex-column justify-content-between"';
    #DIV_TEXTS_SELECTOR = 'class="d-flex flex-column align-items-center justify-content-center pt-4 pb-4"';
    #SPANS_SELECTOR = 'class="title-card w-100 p-3 text-center"';
    #DIV_LINK_SELECTOR = 'class="d-flex flex-row align-items-center justify-content-around pt-3 pb-3 border-top"';
    #SELECT_DATE = 'id="selectDate"';
    #SIMILARITY_PERCENTAGE = 0.80;
    #PARTIAL_NAME_SEARCHED_FILE  = 'InfoMercado - Dados Horários de Consumo';

    constructor(driver, context){
        super(driver, context);
    }

    async getUrlDownloadDadosAnalise(monthYearCurrent){ 
        let url;

        this.context.log('Getting download link from the file:', this.#PARTIAL_NAME_SEARCHED_FILE);
        
        await this.typeText(this.#SELECT_DATE, monthYearCurrent);

        const elements = await this.driver.$$(`[${this.#CARDS_SELECTOR}]`);

        for await(const element of elements){
            const divSpans = await element.$(`[${this.#DIV_TEXTS_SELECTOR}]`);
            const textsDivSpans =  await divSpans.$$eval(`[${this.#SPANS_SELECTOR}]`, element => element.map(x => x.innerText));

            for await(const text of textsDivSpans){
                if(SimilarityService.checkSimilarity(text, this.#PARTIAL_NAME_SEARCHED_FILE, this.#SIMILARITY_PERCENTAGE)){

                    const divLinks = await element.$(`[${this.#DIV_LINK_SELECTOR}]`);

                    url =  await divLinks.$eval('a', element => element.href);
                }
            }
        }

        if(!url)
            throw new Error('Download data not found.');

        this.context.log('Download link obtained successfully:', this.#PARTIAL_NAME_SEARCHED_FILE);

        return url;
    }

    async open(){
        await super.open(this.#URL_CONSUMO);
    }
}
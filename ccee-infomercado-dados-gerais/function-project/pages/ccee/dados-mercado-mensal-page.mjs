import NavigableObject from '../navigable-object.mjs';
import SimilarityService from '../../services/utils/similarity-service.mjs';

export default class CCEEDadosMercadoMensalPage extends NavigableObject{
    #URL_DADOS_MERCADO_MENSAL = 'https://www.ccee.org.br/web/guest/dados-e-analises/dados-mercado-mensal';
    #CARDS_SELECTOR = 'class="card d-flex flex-column justify-content-between"';
    #DIV_TEXTS_SELECTOR = 'class="d-flex flex-column align-items-center justify-content-center pt-4 pb-4"';
    #SPANS_SELECTOR = 'class="title-card w-100 p-3 text-center"';
    #DIV_LINK_SELECTOR = 'class="d-flex flex-row align-items-center justify-content-around pt-3 pb-3 border-top"';
    #SIMILARITY_PERCENTAGE = 0.80;
    #COMPARISON_TEXT = 'Dados e Análises Gerais';

    constructor(driver, context){
        super(driver, context);
    }

    async open(){
        await super.open(this.#URL_DADOS_MERCADO_MENSAL);
    }

    async getUrlDownloadDadosMercadoMensal(){
        let url;

        const elements = await this.getElements(this.#CARDS_SELECTOR);

        for await(const element of elements){
            const divSpans = await element.$(`[${this.#DIV_TEXTS_SELECTOR}]`);
            const textsDivSpans =  await divSpans.$$eval(`[${this.#SPANS_SELECTOR}]`, element => element.map(x => x.innerText));

            for await(const text of textsDivSpans){
                if(SimilarityService.checkSimilarity(text, this.#COMPARISON_TEXT, this.#SIMILARITY_PERCENTAGE)){

                    const divLinks = await element.$(`[${this.#DIV_LINK_SELECTOR}]`);

                    url =  await divLinks.$eval('a', element => element.href);
                }
            }
        }

        if(!url)
            throw new Error('Download data not found.');

        this.context.log('Download link obtained successfully:', this.#COMPARISON_TEXT);

        return url;
    }
}
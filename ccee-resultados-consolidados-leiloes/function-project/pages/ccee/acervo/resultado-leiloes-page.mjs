import NavigableObject from '../../navigable-object.mjs';

export default class CCEEResultadoLeiloesPage extends NavigableObject{
    #URL_RESULTADO_LEILOES = 'https://www.ccee.org.br/acervo-ccee?especie=38753&assunto=39056&keyword=consolidado&periodo=30';
    #CARD_SELECTOR = 'class="card shadow-sm p-2"';
    #CARD_LINK_SELECTOR = 'class="d-flex ms-2 card-link"';

    constructor(driver, context){
        super(driver, context);
    }

    async open(){
        await super.open(this.#URL_RESULTADO_LEILOES);
    }

    async getUrlDownloadResultadosLeiloes(){
        this.context.log('Getting download link from the file: Resultados Leilões');

        const element = await this.driver.$(`[${this.#CARD_SELECTOR}]`);
        let url = await element.$eval(`[${this.#CARD_LINK_SELECTOR}]`, element => element.href);

        if(!url) throw new Error('Download link not found.');

        this.context.log('Download link obtained successfully: Resultados Leilões');

        return  url;
    }
}
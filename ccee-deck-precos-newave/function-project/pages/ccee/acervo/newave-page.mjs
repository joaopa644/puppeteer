import NavigableObject from '../../navigable-object.mjs';
import stringSimilarity from 'string-similarity';

export default class CCEEAcervoNewavePage extends NavigableObject {
    #URL_DECK_PRECOS_NEWAVE =  'https://www.ccee.org.br/acervo-ccee?especie=44884&assunto=39789&keyword=Newave&periodo=30';
    #DECK_PRECOS_NEWAVE_TEXT = 'Deck de Preços - Newave';
    #CARDS_SELECTOR = 'class="card shadow-sm p-2"';
    #CARD_CONTENT_SELECTOR = 'class="card-content"';
    #DECK_PRECOS_NEWAVE_REFERENCE = 'class="refer"';
    #LINK_SELECTOR = 'a';

    constructor(driver, context){
        super(driver, context);
    }


    async open(){
        await super.open(this.#URL_DECK_PRECOS_NEWAVE);
    }

    async getUrlDownloadDeckPrecosNewave(reference){
        this.context.log('Getting download data from the file: Deck de Preços - Newave');

        const cards = await this.driver.$$(`[${this.#CARDS_SELECTOR}]`);

        for await(const card of cards){
            const content = await card.$(`[${this.#CARD_CONTENT_SELECTOR}]`);
            const text = await content.$eval(`${this.#LINK_SELECTOR}`, element => element.innerText);
            
            const refer = await card.$eval(`[${this.#DECK_PRECOS_NEWAVE_REFERENCE}]`, element => element.innerText);
            if(this.#checkSimilarity(text, this.#DECK_PRECOS_NEWAVE_TEXT) && refer.includes(reference)){
                const downloadUrl = await content.$eval(`${this.#LINK_SELECTOR}`, element => element.href);
                
                this.context.log('Download data obtained successfully: Deck de Preços - Newave');

                return downloadUrl;
            }
        }

        throw new Error('Download data not found.');
    }


    #checkSimilarity(stringOne, stringTwo){
        const similarity =  stringSimilarity.compareTwoStrings(stringOne.toUpperCase(), stringTwo.toUpperCase());

        if(similarity > 0.90) return true;

        return false;
    }
}
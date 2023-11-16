export default class NavigableObject {
    driver;
    context;

    constructor(driver, context){
        this.driver = driver;
        this.context = context;
    }

    async open(url){
        await this.driver.goto(url);
        await this.driver.waitForNetworkIdle();
    }

    async typeText(locator, text){
        await this.driver.waitForSelector(`[${locator}]`, { visible: true });
        await this.driver.$eval(`[${locator}]`, element => element.value = "");
        await this.driver.type(`[${locator}]`, text);
    }

    async click(locator){
        await this.waitForSelector(locator);
        const clickableElement = await this.driver.$(`[${locator}]`); 
        clickableElement.click();
    }

    async clickOnRelatedText(baseLocator, textToFind){
        const clickableElement = await this.driver.$$eval(baseLocator, (elements) => 
                                                    elements.find(el => el.textContent.includes(textToFind))
                                                );
        clickableElement.click();
    }

    async waitForNetworkIdle(){
        await this.driver.waitForNetworkIdle();
    }

    async waitForSelector(locator){
        await this.driver.waitForSelector(`[${locator}]`, { visible: true });
        return this.driver;
    }

    getDriver(){
        return this.driver;
    }

    async closePage(){
        await this.driver.close();
    }

    async getElement(selector){
        await this.waitForSelector(selector);
        return await this.driver.$(`[${selector}]`);
    }

    async getElements(selector){
        await this.waitForSelector(selector);
        return await this.driver.$$(`[${selector}]`);
    }

    async getEvalElement(selector, callback, param){
        await this.waitForSelector(selector);
        return await this.driver.$eval(`[${selector}]`, callback, param);
    }

    async getEvalElements(selector, callback){
        await this.waitForSelector(selector);
        return await this.driver.$$eval(`[${selector}]`, callback);
    }

    async getFrame(locator){
        await this.waitForSelector(locator);
        const frameMenu = await this.driver.$(`[${locator}]`);
        const frame = await frameMenu.contentFrame();

        return new NavigableObject(frame, this.context);
    }
}
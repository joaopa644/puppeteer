import fetch from 'node-fetch';

export default class FileDownload{
    #functionContext

    constructor(functionContext){
        this.#functionContext = functionContext;
    }

    async getFile(url){
        return await fetch(url)
            .then(async response => {
                const fileName = this.#getFileName(response);

                this.#functionContext.log('Starting file download:', fileName);

                const buffer = await response.buffer()
                .catch(error =>{
                    throw error;
                });

                this.#functionContext.log('File download successful:', fileName);

                return {fileBuffer: buffer, fileName: fileName};
            })
            .catch(error => {
                throw error;
            });
    }

    #getFileName(response){
        let fileName = '';
        const date = new Date();
        let year = date.getFullYear();
        let mouth = date.getMonth() + 1;
        const headersRaw = response.headers.raw();
        const contentDisposition = headersRaw['content-disposition'][0];
        const splitText = contentDisposition.split('filename=');       
        if(splitText.length > 1){
            fileName = splitText[1].replace('"', '').replace('"', '');
        }else{
            fileName = decodeURI(contentDisposition.split("filename*=UTF-8''")[1].replace('"', ''));
        }           

        return `${mouth}-${year}-${fileName}`;
    }
}
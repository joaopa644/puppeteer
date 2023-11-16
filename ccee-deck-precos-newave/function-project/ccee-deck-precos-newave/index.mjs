import CCEEAcervoNewaveService from '../services/function/ccee-acervo-newave-service.mjs';

export default async function (context, myTimer) {

    const acervoNewaveService = new CCEEAcervoNewaveService(context);
    const currentReference = acervoNewaveService.calculateNewaveRunDate(new Date());

    if(!currentReference){
        context.log('The function was performed outside the expected date. It will complete and run on the next valid date.');
        context.done();
        return;
    }
        
    try{
        await acervoNewaveService.startProcess(currentReference);
        
    }catch(error){
        context.log.error(error);
        context.done(error);
    }
};
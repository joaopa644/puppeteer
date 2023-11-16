import CCEEDadosMercadoMensalService from '../services/functions/ccee-dados-mercado-mensal-service.mjs';

export default async function (context, myTimer) {

    const service = new CCEEDadosMercadoMensalService(context);

    try{
        await service.startProcess();
        
    }catch(error){
        context.log.error(error);
        context.done(error);
    }
};
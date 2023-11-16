import CCEEDadosIndividuaisService from '../services/functions/ccee-dados-individuais-service.mjs';

export default async function (context, myTimer) {

    const service = new CCEEDadosIndividuaisService(context);

    try{
        await service.startProcess();
        
    }catch(error){
        context.log.error(error);
        context.done(error);
    }
};
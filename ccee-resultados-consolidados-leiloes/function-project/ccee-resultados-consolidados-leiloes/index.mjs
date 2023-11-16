import CCEEResultadoLeiloesService from '../services/functions/ccee-resultados-leiloes-service.mjs';

export default async function (context, myTimer) {

    const service = new CCEEResultadoLeiloesService(context);

    try{
        await service.startProcess();
        
    }catch(error){
        context.log.error(error);
        context.done(error);
    }
};
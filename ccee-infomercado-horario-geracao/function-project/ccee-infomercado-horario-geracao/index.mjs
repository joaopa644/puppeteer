import CCEEDadosGeracaoService from '../services/functions/ccee-dados-geracao-service.mjs';

export default async function (context, myTimer) {

    const service = new CCEEDadosGeracaoService(context);

    const currentMonthYear = service.getMonthYearCurrentDadosAnalise();

    try{
        await service.startProcess(currentMonthYear);
        
    }catch(error){
        context.log.error(error);
        context.done(error);
    }
};
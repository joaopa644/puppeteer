import CCEEConsumoService from '../services/functions/ccee-consumo-service.mjs';

export default async function (context, myTimer) {

    const service = new CCEEConsumoService(context);

    const currentMonthYear = service.getCurrentMonthYearDadosAnalise();

    try{
        await service.startProcess(currentMonthYear);
        
    }catch(error){
        context.log.error(error);
        context.done(error);
    }
};
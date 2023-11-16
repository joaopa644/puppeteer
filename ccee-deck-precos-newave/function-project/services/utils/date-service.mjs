export default class DateService{

    addSevenDaysToDate(date){
        return new Date(date.setDate(date.getDate() + 7));
    }
    
    itsFriday(date){
        const dayWeek  = date.toLocaleDateString('pt-BR', { weekday: 'long' });
        if(dayWeek === 'sexta-feira')
            return true;
        
        return false;
    }
    
    areTheDatesInTheSameMonth(dateOne, dateTwo){
        const dateOneMonth = dateOne.getMonth();
        const dateTwoMonth = dateTwo.getMonth();
    
        if(dateOneMonth == dateTwoMonth)
            return true;
    
        return false;
    }
    
    createNewDate(date){
        return new Date(date);
    }
    
    findLastFriday(date){
        const lastDay = new Date(date.setDate(date.getDate() - 1));
        const dayWeek  = lastDay.toLocaleDateString('pt-BR', { weekday: 'long' });
        if(dayWeek === 'sexta-feira')
            return lastDay;
        
        return this.findLastFriday(lastDay);
    }
    
    monthYearFormat (date, addOneMoreMonth){
        if(addOneMoreMonth)
            return this.#calculateNextYear(date);
        
        const currentMonth = date.getMonth() + 1;
        return `${currentMonth < 10? `0${currentMonth}` : currentMonth}/${date.getFullYear()}`;
    }
    
    #calculateNextYear (date){
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();
    
        if(currentMonth == 12)
            return `01/${currentYear + 1}`;
    
        return `${currentMonth < 9? `0${currentMonth + 1}` : currentMonth + 1}/${currentYear}`;
    }
}
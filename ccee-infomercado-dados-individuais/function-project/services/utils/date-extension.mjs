export default class DateExtension{
    #date;

    constructor(options){
        this.#date = this.#setStartData(options);
    }

    #setStartData(options){
        if(options)
            return new Date(options);
        
        return new Date();
    }

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
    
    findLastFriday(){
        const dateClone = this.cloneDate();
        const fridayPtBr = 'sexta-feira';
        
        while(fridayPtBr != dateClone.getWeekday('pt-BR')){
            dateClone.addDay(-1);
        }
        
        return dateClone.getDate();
    }
    
    monthYearFormat(){
        const month = this.#date.getMonth() + 1;
        const year = this.#date.getFullYear();

        return `${month<10? '0' + month : month}/${year}`;
    }

    dayMonthYearFormat(){
        const day = this.#date.getDate();
        const month = this.#date.getMonth() + 1;
        const year = this.#date.getFullYear();

        return `${day<10? '0' + day : day}/${month<10? '0' + month : month}/${year}`;
    }
    
    addMonth(numberOfMonths){
        this.#date.setMonth(this.#date.getMonth() + numberOfMonths);

        return this.#date;
    }

    addDay(numberOfDays){
        this.#date.setDate(this.#date.getDate() + numberOfDays);
    }

    cloneDate(){
        return new DateExtension(this.#date);
    }

    getDate(){
        return this.#date;
    }

    getWeekday(locale){
        if(!locale)
            locale = 'en-US';

        return this.#date.toLocaleDateString(locale, { weekday: 'long' });
    }
}
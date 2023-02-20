import { DateTimeFormatOptions } from 'intl';

export const dateFormat = (inputDate: string) => {
    const date = new Date(inputDate);

    const options: DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);  
    return formatter.format(date);
}

export const currencyFormat = (value: number, currencyIso: string) => {
    const currencySymbols: Record<string, string> = {
        USD: '\u0024',
        EUR: '\u20AC',
        GBP: '\u00A3'
    };
    return `${currencySymbols[currencyIso]} ${value}`;
}
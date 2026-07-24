export const formatPLN = (amount: number) => `${amount.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`;

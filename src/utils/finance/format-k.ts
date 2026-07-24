export const formatK = (amount: number) => (amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : String(Math.round(amount)));

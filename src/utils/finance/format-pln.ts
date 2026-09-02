export const formatPLN = (amount: number) => `${amount.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`;

// A whole-number, no-currency-suffix variant for tight "X / Y" pairs (e.g. spent vs. budget on a category
// row) — the caller appends its own single "zł" once for the whole pair, instead of every number carrying
// its own "PLN" and two decimal places nobody needs at a glance.
export const formatPLNCompact = (amount: number) => Math.round(amount).toLocaleString('pl-PL');

/** Formats a ZAR amount, e.g. 2500 -> "R2 500". */
export const formatRand = (amount: number): string =>
  `R${amount.toLocaleString('en-ZA').replace(/,/g, ' ')}`;

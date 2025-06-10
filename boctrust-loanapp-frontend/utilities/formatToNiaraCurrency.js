export const nigerianCurrencyFormat = new Intl.NumberFormat("en-NG", {
  currency: "NGN",
  style: "currency",
});

export const currencyFormat =  new Intl.NumberFormat("en-NG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

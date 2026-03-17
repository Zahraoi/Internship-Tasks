export const CURRENCY = {
  symbol: 'Rs. '
};

export const formatCurrency = (amount) => {
  return `${CURRENCY.symbol}${amount.toLocaleString()}`;
};

export const formatCurrencyValue = (amount) => {
  return amount.toLocaleString();
};

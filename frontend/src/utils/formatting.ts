export const formatPrice = (price: number): string => {
  if (price <= 0) {
    return 'Free to play';
  }

  return `${price.toFixed(2)} €`;
};
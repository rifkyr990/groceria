export const formatIDRCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const upperFirstCharacter = (char: string) => {
  return char.charAt(0).toUpperCase() + char.slice(1);
};

// format hari

export const formatDate = (value: string | Date) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

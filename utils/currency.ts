export const numberFormat = (
  num: number,
  fractionDigits?: number,
  locale?: string
) => {
  return num
    ? num.toLocaleString(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })
    : 0;
};

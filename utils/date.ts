import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/id";

export const DEFAULT_DATE_FORMAT = "YYYY/MM/DD";
export const DEFAULT_DATE_FORMAT_DASH = "YYYY-MM-DD";
export const DATE_SHORT_FORMAT = "D MMM YYYY";
export const DATETIME_SHORT_FORMAT = "D MMM YYYY HH:mm";
export const DATE_FULL_FORMAT = "D MMMM YYYY";
export const DATE_MONTH_FORMAT = "YYYY/MM";
export const DATE_MONTH_FORMAT_DASH = "YYYY-MM";
export const FULL_DATE_TIME_FORMAT = "MMM D, YYYY HH:mm A";

export const getDate = (
  str: string | Date,
  format: string = DEFAULT_DATE_FORMAT
) => {
  return str ? dayjs(str).format(format) : "";
};

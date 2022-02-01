import dayjs, { ManipulateType } from "dayjs";

export const dayJS = dayjs;

export const formatDate = (
  value: Date | number | string = Date.now(),
  format: string = "DD-MM-YYYY"
) => {
  return dayjs(value).format(format);
};

export const formatDateTime = (
  value: Date | number | string = Date.now(),
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  return dayjs(value).format(format);
};

export const addDateTime = (
  dtValue: Date | number | string = Date.now(),
  addValue: number,
  addUnit: ManipulateType = "day",
  format: string = "YYYY-MM-DD HH:mm:ss"
) => {
  return dayjs(dtValue).add(addValue, addUnit).format(format);
};

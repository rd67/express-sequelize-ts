import moment from "moment";

export const formatDate = (
  value: Date | number | string = Date.now(),
  format: string = "DD-MM-YYYY"
) => {
  return moment(value).format(format);
};

export const formatDateTime = (
  value: Date | number | string = Date.now(),
  format: string = "DD-MM-YYYY HH:mm:ss"
): string => {
  return moment(value).format(format);
};

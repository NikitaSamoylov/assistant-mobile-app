import moment from "moment";

export const checkIsAccountExpired = (dateString: string) => {
  const expiredDate = moment(dateString, 'DD.MM.YYYY');
  const now = moment();

  return expiredDate.isBefore(now, 'day');
};
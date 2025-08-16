import moment from "moment";

export const detectProductTimeLeft = (expiredDate: string) => {
  const timeLeft = moment(expiredDate, 'DD.MM.YYYY').startOf('day').diff(moment().startOf('day'), 'days');

  if (timeLeft <= 0) {
    return 'expired';
  };
  if (timeLeft > 1) {
    return 'fresh';
  };
  if (timeLeft === 1) {
    return 'deadline';
  };

  return String(timeLeft);
};
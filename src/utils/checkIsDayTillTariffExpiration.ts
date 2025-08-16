import moment from "moment";

export const checkIsDayToTariffExpiration = (tariffExpiration: string) => {
  if (!tariffExpiration) return;

  const expiryTariffDate = moment(tariffExpiration, 'DD.MM.YYYY');
  const today = moment().startOf('day');

  if (expiryTariffDate.isSame(today, 'day')) {
    return true;
  } else {
    return false;
  };
};
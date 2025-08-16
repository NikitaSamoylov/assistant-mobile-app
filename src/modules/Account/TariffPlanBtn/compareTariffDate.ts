import moment from 'moment';

export const compareTariffDate = (dateString: string) => {
  if (!dateString) return;

  const date = moment(dateString, 'DD.MM.YYYY');
  const today = moment();

  const daysDiff = date.diff(today, 'days');

  if (daysDiff === 0) return 'до завтра';
  if (daysDiff === 1) return 'до послезавтра';

  return `до ${date.format('DD.MM.YYYY')}`;
};
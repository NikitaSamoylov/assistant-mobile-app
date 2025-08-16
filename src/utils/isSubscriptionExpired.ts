import moment from "moment";

export const isSubscriptionExpired = (expired: string) => {
  if (!expired) return;

  const today = moment();
  const expiryDate = moment(expired);

  // Проверяем, истекла ли подписка
  if (expiryDate.isBefore(today, 'day')) {
    return true; // подписка истекла
  } else {
    return false; // подписка еще активна
  };
};
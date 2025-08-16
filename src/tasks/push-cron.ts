import User from '@/lib/models/User';
import { connectDB } from '@/lib/connectDataBase';
import { PushSubscription } from 'web-push';
import webpush from 'web-push';
import moment from 'moment';
import { TProduct } from '@/lib/types/product';
import Backup from '@/lib/models/Backup';

webpush.setVapidDetails(
  'mailto:nsam7655@gmail.com',
  "BNe9MyZhFWbE2KopCjjuLdsvCFS1EAu-NGHtJBi5J1BKmobmnkH0E8svXbISd3H1wdCQZ4q91sLFdqt4qi0mN4U",
  "SHLUSIDpEnKjVpBDZjENMK4Y9gGkH7EP3LZkWioA9Jo"
);

// Ваша функция отправки уведомлений
const sendPushNotification = async (subscription: PushSubscription, message: string) => {
  const payload = JSON.stringify({
    title: 'Привет!',
    body: message,
    icon: '/logo192.png',
  });
  try {
    await webpush.sendNotification(subscription, payload);
    console.log('Уведомление отправлено');
  } catch (err) {
    console.error('Ошибка отправки:', err);
  };
};

export const startCron = async () => {
  await connectDB();

  const users = await User.find({
    'pushSubscription.endpoint': { $exists: true, $ne: null },
    timezone: { $exists: true }
  });

  const now = new Date();

  for (const user of users) {
    if (!user.pushSubscription || !user.timezone) continue;

    const parts = new Intl.DateTimeFormat('ru-RU', {
      timeZone: user?.timezone,
      hour: 'numeric',
      hour12: false,
    }).formatToParts(now);

    const hourPart = parts.find(part => part.type === 'hour');

    const currentHour = hourPart ? parseInt(hourPart.value, 10) : null;

    console.log('before check user hour', currentHour);

    console.log('currentHour', currentHour);
    console.log('user notify time', user?.timeToNotify);

    if (currentHour == user?.timeToNotify) {
      console.log('hours are equals');

      // Проверка продуктов пользователя
      const userProducts = await Backup.find({ userId: user._id });

      // Проверка, есть ли у пользователя продукты с сроком истечения завтра
      const hasExpiringSoonProduct = userProducts?.some((productDoc) => {
        // В каждом документе есть поле products, массив продуктов
        return productDoc.backup.existingProducts?.some((product: TProduct) => {
          const expiryDate = moment(product.expiredDate, 'DD.MM.YYYY');
          const daysDiff = expiryDate.startOf('day').diff(moment().startOf('day'), 'days');
          return daysDiff === 1; // завтра
        });
      });

      const isUserHasProducts = userProducts.some((productDoc) => {
        return productDoc.backup.existingProducts.length > 0;
      });

      if (user?.isLogged) {
        if (hasExpiringSoonProduct) {
          await sendPushNotification(user.pushSubscription, 'Завтра сроки истекают');
        }
        else if (isUserHasProducts) {
          await sendPushNotification(user.pushSubscription, 'Часть продуктов закончилась? Удалим?');
        };
        // else if (!isUserHasProducts && !hasExpiringSoonProduct) {
        //   await sendPushNotification(user.pushSubscription, 'Добавим первый продукт?');
        // };
      };
    };
  };
};
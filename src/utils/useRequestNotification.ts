'use client';

import { setPushSubscr } from "@/lib/store/features/pushSubscrSlice";
import { useDispatch, useSelector } from "react-redux";
import { urlBase64ToUint8Array } from "./urlBaseToUnit";
import { RootState } from "@/lib/store/store";

export const useRequestNotificationPermission = ({ userId }: { userId: string | undefined }) => {
  const { userSession } = useSelector((state: RootState) => state.userSession);
  const dispatch = useDispatch();

  const requestPermission = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Ваш браузер не поддерживает Push-уведомления');
      return;
    }

    try {
      // Регистрация сервис-воркера
      const registration = await navigator.serviceWorker.register('/sw.js');

      // Дождаться полной активации сервис-воркера
      if (!registration.active) {
        await new Promise<void>((resolve) => {
          if (registration.installing) {
            registration.installing.addEventListener('statechange', (event) => {
              if ((event.target as ServiceWorker)?.state === 'activated') resolve();
            });
          } else if (registration.waiting) {
            registration.waiting.addEventListener('statechange', (event: Event) => {
              if ((event.target as ServiceWorker)?.state === 'activated') return new Promise<void>((resolve) => {
                resolve();
              });
            });
          } else {
            // Уже активен
            resolve();
          }
        });
      }

      // Запрос разрешения на уведомления
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.log('Разрешение на уведомления не предоставлено');
        return;
      }

      // Создаем подписку
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Отправляем подписку на сервер
      const response = await fetch('/api/subscribe-to-push', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, subscription, timeToNotify: userSession?.timeToNotify || '20' }),
      });
      const respData = await response.json();

      // Обновляем состояние в redux
      dispatch(setPushSubscr(respData.message));
    } catch (error) {
      console.error('Ошибка при подписке:', error);
    }
  };

  return { requestPermission };
};
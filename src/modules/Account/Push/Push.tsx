'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import classNames from 'classnames';
import useFetch from '@/utils/hooks.ts/useFetch';
import { useRequestNotificationPermission } from '@/utils/useRequestNotification';
import { removePushSubscr, setPushSubscr } from '@/lib/store/features/pushSubscrSlice';
import { setNoInternetMsg } from '@/lib/store/features/noInternetSlice';
import styles from './Push.module.css';

export const Push = () => {
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const userSubscr = useSelector((state: RootState) => state.isPushSubscr.isPushSubscr);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const dispatch = useDispatch();

  const { fetch: fetchRequest } = useFetch<{ message: PushSubscription }>();
  const { requestPermission } = useRequestNotificationPermission({ userId })

  const removeSubscription = () => {
    if (!userId) return;

    fetchRequest('/api/subscribe-to-push', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userId)
    })
      .then(() => dispatch(removePushSubscr()));
  };

  const toggleSwitch = async () => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };
    if (!userId) return;
    if (userSubscr) {
      dispatch(setPushSubscr(false));
      removeSubscription();
      return;
    };

    dispatch(setPushSubscr(true));
    await requestPermission();
  };

  return (
    <>
      <div
        onClick={toggleSwitch}
        className={classNames(styles.wrapper, userSubscr ? styles.ison : styles.isoff)}
      >
        <div className={classNames(styles.switcher, userSubscr ? styles.switchon : styles.switchoff)} />
      </div>
    </>
  )
};
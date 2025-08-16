'use client';

import { IoIosNotificationsOutline } from "react-icons/io";
import { Badge } from "@/components/Badge";
import styles from './Notifications.module.css';

export const Notifications = () => {
  return (
    <article>
      <button>
        <Badge label={''}>
          <IoIosNotificationsOutline className={styles.icon} />
        </Badge>
      </button>
    </article>
  )
};
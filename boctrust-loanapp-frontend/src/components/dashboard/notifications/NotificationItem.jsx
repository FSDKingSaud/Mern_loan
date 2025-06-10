import React from "react";
import { CiBullhorn } from "react-icons/ci";
import styles from "./Notification.module.css";
import { format } from "date-fns";

const NotificationItem = ({ message, createdAt }) => {
  return (
    <div className={styles.notificationItemWrapper}>
      <div className={styles.notificationIcon}>
        <CiBullhorn size={26} />
      </div>

      <div className={styles.notificationItemInside}>
        <p>{message}</p>

        <span>{format(new Date(createdAt), "dd/LL/yyyy, hh:mm aaa")}</span>
      </div>
    </div>
  );
};

export default NotificationItem;

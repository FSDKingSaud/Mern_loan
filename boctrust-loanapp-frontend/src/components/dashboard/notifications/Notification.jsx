import React, { useState, useEffect } from "react";
import styles from "./Notification.module.css";
import { FaRegBell } from "react-icons/fa";
import NotificationItem from "./NotificationItem";
import PageLoader from "../shared/PageLoader";
import apiClient from "../../../lib/axios";
import { Button } from "react-bootstrap";
import NextPreBtn from "../shared/NextPreBtn";
import DashboardHeadline from "../shared/DashboardHeadline";
import { emptyUnreadNotifications } from "../../../redux/reducers/notificationReducer";
import { useDispatch } from "react-redux";

const Notifications = () => {
  const [notificationsData, setNotificationsData] = useState(null);
  const [showCount, setShowCount] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        let url = "/notification";
        if (showCount) {
          url += `?limit=${showCount}`;
        }

        if (currentPage) {
          url += `&page=${currentPage}`;
        }
        const {
          data: {
            data: { notifications, totalPages },
          },
        } = await apiClient.get(url);
        setTotalPages(totalPages);
        setNotificationsData(notifications);
        dispatch(emptyUnreadNotifications());
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [currentPage, currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="MainBox">
      <div className="Search">
        <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
          <div className="SearchBar">
            <div className="FormGroup">
              <label htmlFor="show">Show</label>
              <input
                name="showCount"
                type="number"
                step={10}
                min={10}
                value={showCount}
                onChange={(e) => setShowCount(e.target.value)}
              />
            </div>
          </div>
        </DashboardHeadline>
      </div>
      <div className={styles.notificationWrapper}>
        <div>
          <h2>
            <FaRegBell size={24} /> Notifications
          </h2>

          <Button variant="outline">Mark all as read</Button>
        </div>
        <div className={styles.notificationContainer}>
          {!notificationsData ? (
            <PageLoader />
          ) : notificationsData && notificationsData.length > 0 ? (
            notificationsData.map((notification) => (
              <React.Fragment key={notification.id}>
                <NotificationItem {...notification} />
              </React.Fragment>
            ))
          ) : (
            <p className="empty">No new notifications</p>
          )}
        </div>
      </div>
      <NextPreBtn
        currentPage={currentPage}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
      />
    </div>
  );
};

export default Notifications;

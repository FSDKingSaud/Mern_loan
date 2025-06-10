import React, { useEffect, useState } from "react";
import styles from "./ConsentCookieAnalytics.module.css";
import apiClient from "../../../../lib/axios";
import PageLoader from "../../shared/PageLoader";

const ConsentCookieAnalytics = () => {
  const [cookieStats, setCookieStats] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await apiClient.get("/consent-cookie/stats");
        setCookieStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return cookieStats ? (
    <div className={styles.container}>
      <ConsentCookieCard
        cardTitle={"Total Cookies"}
        detailValue={cookieStats.totalCount}
        detailTitle={"all time cookies"}
      />
      <ConsentCookieCard
        cardTitle={"This Month Cookies"}
        detailValue={cookieStats.monthlyCount}
        detailTitle={"all time cookies for the month"}
      />
      <ConsentCookieCard
        cardTitle={"Today Cookies"}
        detailValue={cookieStats.dailyCount}
        detailTitle={"all time cookies for today"}
      />
      <ConsentCookieCard
        cardTitle={"Accepted Cookies"}
        detailValue={cookieStats.acceptedCookie}
        detailTitle={"all cookies accepted"}
      />
      <ConsentCookieCard
        cardTitle={"Rejected Cookies"}
        detailValue={cookieStats.rejectedCookie}
        detailTitle={"all cookies rejected"}
      />
    </div>
  ) : (
    <div>
      <PageLoader width="80px" />
    </div>
  );
};

export default ConsentCookieAnalytics;

const ConsentCookieCard = ({ cardTitle, detailTitle, detailValue }) => {
  return (
    <div className={styles.card__wrapper}>
      <div>
        <div className={styles.store__name}>
          <h5 className="textMedium12">{cardTitle}</h5>
        </div>

        <div className={styles.store__info}>
          <div>
            <span className="textLight12">{detailTitle}</span>
            <h6 className="text20">{detailValue}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

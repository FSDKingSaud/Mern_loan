import FigCard from "../../shared/FigCard";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Headline from "../../../shared/Headline";
import "./AdminDashboard.css";
import LoansCard from "./LoansCard";
import StatCard from "./StatCard";
import BocChart from "./BocChart";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentDateFormatted,
  getYesterdayDate,
  getCurrentMonthAndYear,
  getLastMonthAndYear,
  getCurrentYear,
} from "./dashboradfunc";
import PageLoader from "../../shared/PageLoader";
import { fetchAllLoans } from "../../../../redux/reducers/loanReducer";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import apiClient from "../../../../lib/axios";
import { Col, Row } from "react-bootstrap";

const HomeDashboard = () => {
  const [customerAnalytics, setCustomerAnalytics] = useState({
    kycCompleted: null,
    withCoo: null,
    withOperations: null,
    withCredit: null,
    booked: null,
    completed: null,
  });
  const [disbursementAnalytics, setDisbursementAnalytics] = useState({
    today: 0.0,
    yesterday: 0.0,
    thisMonth: 0.0,
    lastMonth: 0.0,
  });
  const [collectionAnalytics, setCollectionAnalytics] = useState({
    today: 0.0,
    yesterday: 0.0,
    thisMonth: 0.0,
    lastMonth: 0.0,
  });
  // fetch all customer data
  const dispatch = useDispatch();

  const { allLoans } = useSelector((state) => state.loanReducer);
  const { customer: customers } = useSelector(
    (state) => state.customerReducer.customers
  );

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(fetchAllLoans()).catch((error) =>
          console.error("Error fetching Loans:", error)
        );
        dispatch(fetchAllCustomer()).catch((error) =>
          console.error("Error fetching Customer:", error)
        );

        const {
          data: { data: disbursementAnalyticsData },
        } = await apiClient.get(`/analytics/disbursements`);
        const {
          data: { data: collectionAnalyticsData },
        } = await apiClient.get(`/analytics/collections`);

        if (disbursementAnalyticsData) {
          setDisbursementAnalytics(disbursementAnalyticsData);
        }
        if (collectionAnalyticsData) {
          setCollectionAnalytics(collectionAnalyticsData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    if (allLoans && customers) {
      setCustomerAnalytics({
        ...customerAnalytics,
        booked: allLoans?.filter((loan) => loan?.loanstatus === "booked") || [],
        kycCompleted:
          customers?.filter(
            (customer) => customer?.kyc?.isKycApproved === true
          ) || [],
        withCoo:
          allLoans?.filter(
            (loan) =>
              loan?.loanstatus === "with coo" || loan?.loanstatus === "unbooked"
          ) || [],
        withCredit:
          allLoans?.filter(
            (loan) =>
              loan?.loanstatus === "with credit" &&
              loan?.customer?.kyc?.isKycApproved === true
          ) || [],

        withOperations:
          allLoans?.filter((loan) => loan?.loanstatus === "with operations") ||
          [],

        completed:
          allLoans?.filter((loan) => loan?.loanstatus === "completed") || [],
      });
    }
  }, [allLoans, customers]);

  // check
  return (
    <>
      <div className="TopCard">
        <Row className="g-3">
          <Col >
            <FigCard>
              {customerAnalytics.completed ? (
                <h4 className="Title">
                  {customerAnalytics.kycCompleted.length || "0"}
                </h4>
              ) : (
                <PageLoader width="28px" />
              )}
              <img className="CardIcon" src="/images/eyes.png" alt="icon" />
              <p>Total Customers</p>
            </FigCard>
          </Col>

          <Col >
            <FigCard>
              {customerAnalytics.completed ? (
                <h4 className="Title">
                  {customerAnalytics.completed.length || "0"}
                </h4>
              ) : (
                <PageLoader width="28px" />
              )}
              <img className="CardIcon" src="/images/eyes.png" alt="icon" />
              <p>Total No Disbursed</p>
            </FigCard>
          </Col>
        </Row>
      </div>

      <div className="Stat">
        <div className="LoansStat">
          <Headline spacer="0 0 0.6rem 0" align="left" text="Loans" />
          <div className="InlineCard">
            <LoansCard
              img="/images/padding.png"
              title="With Operations"
              stat={customerAnalytics.withOperations?.length}
              bgcolor="#ea5767"
            />
            <LoansCard
              img="/images/star.png"
              title="With Credit"
              stat={customerAnalytics.withCredit?.length}
              bgcolor="#f6ab60"
            />

            <LoansCard
              img="/images/thumbup.png"
              title="With COO/Unbooked"
              stat={customerAnalytics.withCoo?.length}
              bgcolor="#32c6c7"
            />
            <LoansCard
              img="/images/star.png"
              title="Booked"
              stat={customerAnalytics.booked?.length}
              bgcolor="#ecaa00"
            />

            <LoansCard
              img="/images/active.png"
              title="Completed"
              stat={customerAnalytics.completed?.length}
              bgcolor="#2bb294"
            />
            {/* add here */}
          </div>
        </div>

        <div className="LoansStat">
          <Headline
            spacer="1.5rem 0 0.6rem 0"
            align="left"
            text="Collections"
          />
          <div className="InlineCard collections">
            <StatCard
              day="Today"
              date={getCurrentDateFormatted()}
              stat={collectionAnalytics.today}
              datecolor="#2bb294"
            />
            <StatCard
              day="Yesterday"
              date={getYesterdayDate()}
              stat={collectionAnalytics.yesterday}
              datecolor="#20c0ec"
            />
            <StatCard
              day="This Month"
              date={getCurrentMonthAndYear()}
              stat={collectionAnalytics.thisMonth}
              datecolor="#2585c3"
            />
            <StatCard
              day="Last Month"
              date={getLastMonthAndYear()}
              stat={collectionAnalytics.lastMonth}
              datecolor="#f6ab60"
            />
          </div>
        </div>
        <div className="LoansStat">
          <Headline
            spacer="1.5rem 0 0.6rem 0"
            align="left"
            text="Disbursement"
          />
          <div className="InlineCard collections">
            <StatCard
              day="Today"
              date={getCurrentDateFormatted()}
              stat={disbursementAnalytics.today}
              datecolor="#2bb294"
            />
            <StatCard
              day="Yesterday"
              date={getYesterdayDate()}
              stat={disbursementAnalytics.yesterday}
              datecolor="#20c0ec"
            />
            <StatCard
              day="This Month"
              date={getCurrentMonthAndYear()}
              stat={disbursementAnalytics.thisMonth}
              datecolor="#2585c3"
            />
            <StatCard
              day="Last Month"
              date={getLastMonthAndYear()}
              stat={disbursementAnalytics.lastMonth}
              datecolor="#f6ab60"
            />
          </div>
        </div>
      </div>

      {/* stat chart section */}
      <div className="Stat">
        <DashboardHeadline mspacer="0 0 4rem 0">
          Disbursement & Collections Analytics - {getCurrentYear()}
        </DashboardHeadline>
        <BocChart />
      </div>
    </>
  );
};

export default HomeDashboard;

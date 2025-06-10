import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import BocButton from "../../shared/BocButton";
import "../../Dashboard.css";
import { useEffect, useState } from "react";
import TableStyles from "../tables/TableStyles.module.css";
import { fetchUserTransactions } from "../../../../redux/reducers/transactionReducer";
import PageLoader from "../../shared/PageLoader";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import TransactionModal from "./TransactionModal";
import { format } from "date-fns";
import DashboardHeadline from "../../shared/DashboardHeadline";
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import NextPreBtn from "../../shared/NextPreBtn";
import { getCurrentMonthDates } from "../../admindashboard/dashboardhome/dashboradfunc";

const AccountTransaction = () => {
  const styles = {
    th: {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    completed: {
      color: "#5cc51c",
    },
  };
  const [showCount, setShowCount] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState(getCurrentMonthDates());

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { userTransactions, status } = useSelector(
    (state) => state.transactionReducer
  );

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData, totalPages: noOfPages } = usePaginatedData(
    userTransactions,
    showCount,
    currentPage
  );

  const user = useSelector((state) => state.adminAuth.user);

  const dispatch = useDispatch(0);

  useEffect(() => {
    setTotalPages(noOfPages); // Update total pages when it changes
  }, [noOfPages, setTotalPages]);

  useEffect(() => {
    const getData = async () => {
      if (!user || !user.banking?.accountDetails?.AccountNumber) return;

      try {
        const { endDate, startDate } = dateFilter;

        await dispatch(
          fetchUserTransactions({
            accountNumber: user.banking?.accountDetails?.AccountNumber,
            fromDate: startDate,
            toDate: endDate,
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [user, dateFilter]);

  return (
    <div className={TableStyles.table__wrapper}>
      <div className="d-flex justify-content-center">
        <div className={TableStyles.filter__box}>
          <div className="d-flex flex-column ">
            <label htmlFor={"startDate"}>Start Date</label>
            <input
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  startDate: e.target.value,
                })
              }
              type="date"
              name="startDate"
            />
          </div>
          <div className="d-flex flex-column ">
            <label htmlFor={"endDate"}>End Date</label>
            <input
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  endDate: e.target.value,
                })
              }
              type="date"
              name="endDate"
            />
          </div>
        </div>
      </div>
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -3.2rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.th}>
            <th>Date</th>
            <th>AC Number</th>
            <th>Amount</th>
            <th>Dr/Cr</th>
            <th>Type</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {!paginatedData || status === "loading" ? (
            <tr className={TableStyles.row}>
              <td colSpan="7">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr className={TableStyles.row}>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No recent transactions
              </td>
            </tr>
          ) : (
            paginatedData &&
            paginatedData.map((transaction, index) => {
              return (
                <tr key={index} className={TableStyles.row}>
                  <td>
                    {transaction?.CurrentDate
                      ? format(
                          transaction?.CurrentDate,
                          "dd/LL/yyyy, hh:mm aaa"
                        )
                      : ""}
                  </td>
                  <td>{transaction?.AccountNumber || "NIL"}</td>
                  <td>
                    {nigerianCurrencyFormat.format(transaction?.Amount / 100)}
                  </td>
                  <td>{transaction?.RecordType}</td>
                  <td>{transaction?.PostingType} </td>
                  <td style={styles.completed}>{transaction?.status}</td>
                  <td>
                    <BocButton
                      func={() => setSelectedTransaction(transaction)}
                      cursor="pointer"
                      bgcolor="#145098"
                      bradius="18px"
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      <NextPreBtn
        currentPage={currentPage}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
      />

      {selectedTransaction ? (
        <TransactionModal
          selectedTransaction={selectedTransaction}
          handleClose={() => setSelectedTransaction(null)}
        />
      ) : null}
    </div>
  );
};

export default AccountTransaction;

import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import ViewBySection from "../remita/ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";
import "./debit.css";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import getDateOnly from "../../../../../utilities/getDate.js";
import apiClient from "../../../../lib/axios.js";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency.js";
import BocButton from "../../shared/BocButton.jsx";
import { toast } from "react-toastify";
import { useDebounce } from "../../../../../utilities/debounce.js";

const styles = {
  btnBox: {
    display: "flex",
    justifyContent: "center",
  },
  table: {
    //   margin: "0 2rem 0 3rem",
    fontSize: "14px",
  },
  head: {
    color: "#fff",
    fontSize: "1rem",
  },
  approved: {
    backgroundColor: "#5cc51c",
  },
  approve: {
    backgroundColor: "#ecaa00",
  },
  pending: {
    backgroundColor: "red",
  },
  review: {
    backgroundColor: "#145098",
  },
  pendingTxt: {
    color: "red",
  },
  activeTxt: {
    color: "green",
  },
};

const DebitTransactions = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [transactionList, setTransactionList] = useState(null);

  const debouncedSearch = useDebounce(searchTerms, 3000);

  const getData = async ({ forToday, forDateRange }) => {
    try {
      setStatus("loading");

      let url = `/nibss/debit-transactions?limit=${showCount}`;

      if (debouncedSearch) {
        url += `&search=${debouncedSearch}`;
      }

      if (currentPage) {
        url += `&page=${currentPage}`;
      }

      if (forToday) {
        url += `&todayRecord=${true}`;
      }
      if (forDateRange) {
        url += `&startDate=${dateRange.fromDate}&endDate=${dateRange.toDate}`;
      }

      const {
        data: { nddDebitTransaction, totalPages },
      } = await apiClient.get(url);
      setTransactionList(nddDebitTransaction);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setStatus("");
    }
  };

  useEffect(() => {
    getData({});
  }, [debouncedSearch, showCount, currentPage]);

  useEffect(() => {
    if (dateRange.fromDate && dateRange.toDate) {
      getData({ forDateRange: true });
    }
  }, [dateRange]);

  // Handle list reload
  const handleReload = async () => {
    await getData({});
  };

  // Open review modal
  const handleProcess = async (transaction) => {
    try {
      setIsLoading(true);
      setSelectedTransaction(transaction._id)

      await apiClient.post(`/nibss/interbankTransfer/${transaction._id}`);

      toast.success("Money Transfer Success");
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setIsLoading(false);
      setSelectedTransaction(null)
    }
  };

  const searchByDate = async () => {
    await getData({
      forToday: true,
    });
  };

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
    <div>
      {/* view by section */}
      <ViewBySection
        firstBtn="Debits Today"
        setSearch={setSearchTerms}
        setDateRange={setDateRange}
        dateRange={dateRange}
        searchDateFunc={searchByDate}
        handleReload={handleReload}
      />

      {/* table section */}
      <div className="RBox">
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -3.24rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>S/N</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Account Number</th>
                <th>Amount</th>
                <th>Debit Mandate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan="10">
                    <PageLoader />
                  </td>
                </tr>
              ) : (
                <>
                  {transactionList?.length === 0 && (
                    <tr>
                      <td colSpan="10">
                        <NoResult name="NDD Transaction" />
                      </td>
                    </tr>
                  )}

                  {transactionList?.map((transaction, index) => (
                    <tr key={transaction?._id}>
                      <td>{index + 1}</td>
                      <td>{getDateOnly(transaction?.createdAt)}</td>
                      <td>
                        {transaction.mandate?.customer.firstname}{" "}
                        {transaction.mandate?.customer.lastname}
                      </td>
                      <td>
                        {transaction.mandate?.customer.salaryaccountnumber}
                      </td>
                      <td>
                        {nigerianCurrencyFormat.format(transaction.amount)}
                      </td>
                      <td>{transaction.mandate.debitMandate.code}</td>

                      <td className="booking_status">
                        {transaction.status == "00" ? (
                          <span className="badge_success">Success</span>
                        ) : (
                          <span className="badge_pending">Pending</span>
                        )}
                      </td>
                      <td className="booking_status">
                        <BocButton
                          bradius="12px"
                          fontSize="14px"
                          width="90px"
                          bgcolor="#145088"
                          disable={isLoading || transaction.hasBalancedLoanAcc}
                          func={() => {
                            handleProcess(transaction);
                          }}
                        >
                          Balance Loan
                          {isLoading && selectedTransaction == transaction._id && (
                            <PageLoader width="20px" strokeColor="#ffffff" />
                          )}
                        </BocButton>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </Table>
        </div>
        <NextPreBtn
          currentPage={currentPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      </div>
    </div>
  );
};

export default DebitTransactions;

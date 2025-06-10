import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import ViewBySection from "../remita/ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import "./debit.css";
import BocButton from "../../shared/BocButton.jsx";

// custom hook
import apiClient from "../../../../lib/axios.js";
import { useDebounce } from "../../../../../utilities/debounce.js";
import getDateOnly from "../../../../../utilities/getDate.js";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency.js";

const CollectionSummary = () => {
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

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [status, setStatus] = useState("");

  const [collectionList, setCollectionList] = useState(null);

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

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
      setCollectionList(nddDebitTransaction);
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
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  useEffect(() => {
    if (dateRange.fromDate && dateRange.toDate) {
      getData({ forDateRange: true });
    }
  }, [dateRange]);

  // handle list reload
  const handleReload = () => {
    getData({});
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
        firstBtn="Collections Today"
        setSearch={setSearchTerms}
        setDateRange={setDateRange}
        dateRange={dateRange}
        searchDateFunc={searchByDate}
        handleReload={handleReload}
        printBtn={
          <BocButton
            margin="8px 18px"
            bgcolor="#145098"
            bradius="25px"
            width="90px"
          >
            Print
          </BocButton>
        }
      />

      {/* table section */}
      <div className="RBox">
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -3.4rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>S/N</th>
                <th>Customer ID</th>
                <th>Loan Acc</th>
                <th>Amount Debited</th>
                <th>Loan Amount</th>
                <th>Mandate Reference</th>
                <th>Start Date</th>
                <th>End Date</th>
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
                  {collectionList?.length === 0 && (
                    <tr>
                      <td colSpan="10">
                        <NoResult name="Collection" />
                      </td>
                    </tr>
                  )}

                  {collectionList?.length > 0 &&
                    collectionList.map((collection, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {
                            collection.mandate?.customer?.banking
                              ?.accountDetails?.CustomerID
                          }
                        </td>
                        <td>{collection?.mandate?.loan.loanAccountNumber}</td>

                        <td>
                          {nigerianCurrencyFormat.format(collection.amount)}
                        </td>
                        <td>
                          {nigerianCurrencyFormat.format(
                            collection?.mandate?.loan.loanamount
                          )}
                        </td>
                        <td>{collection.mandate.debitMandate.code}</td>
                        <td style={styles.activeTxt}>
                          {getDateOnly(collection.mandate.startDate)}
                        </td>
                        <td style={styles.pendingTxt}>
                          {getDateOnly(collection.mandate.endDate)}
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

export default CollectionSummary;

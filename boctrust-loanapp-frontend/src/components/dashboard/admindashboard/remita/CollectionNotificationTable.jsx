import React, { useEffect, useState } from "react";
import NextPreBtn from "../../shared/NextPreBtn";
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchRemitaCollections } from "../../../../redux/reducers/loanReducer";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

import Headline from "../../../shared/Headline";
import DashboardHeadline from "../../shared/DashboardHeadline";
import { Table } from "react-bootstrap";
import NoResult from "../../../shared/NoResult";
import PageLoader from "../../shared/PageLoader";

const styles = {
  table: {
    //   margin: "0 2rem 0 3rem",
    fontSize: "14px",
  },
  head: {
    color: "#fff",
    fontSize: "1rem",
  },
  approved: {
    color: "#5cc51c",
  },
  completed: {
    color: "#ecaa00 ",
  },
  disbursed: {
    color: "#2563eb",
  },
  pending: {
    color: "#f64f4f",
  },
  topUp: {
    color: "#ecaa00",
    fontSize: "0.6rem",
  },
};

const CollectionNotificationTable = ({ handleClose }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [showCount, setShowCount] = useState(5);

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedLoanId = searchParams.get("loanId");

  const { remitaCollection, status } = useSelector(
    (state) => state.loanReducer
  );

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData: paginatedCollectionList, totalPages: noOfPages } =
    usePaginatedData(remitaCollection, showCount, currentPage);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchRemitaCollections(selectedLoanId));
    };
    if (selectedLoanId) getData();
  }, [dispatch]);

  useEffect(() => {
    setTotalPages(noOfPages); // Update total pages when it changes
  }, [noOfPages, setTotalPages]);

  return (
    <div>
      <div className="d-flex align-items-end gap-3">
        <Headline
          align="left"
          spacer="28px 0 -6px 0"
          fontSize="22px"
          text="Loan Collection Details"
        />
      </div>

      <div className="bSection">
        {status === "loading" && <PageLoader />}
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -3.2rem -0.5rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>S/N</th>
                <th>Collection Id</th>
                <th>Net Salary</th>
                <th>Amount</th>
                <th>Total Credit</th>
                <th>Balance Due</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCollectionList &&
                paginatedCollectionList?.length === 0 && (
                  <td colSpan={7}>
                    <NoResult name="Collection Notification" />
                  </td>
                )}
              {paginatedCollectionList &&
                paginatedCollectionList?.map((collection, index) => {
                  return (
                    <tr key={collection._id}>
                      <td>{index + 1}</td>
                      <td>{collection.collectionId}</td>
                      <td>
                        {nigerianCurrencyFormat.format(collection.netSalary)}
                      </td>
                      <td>
                        {nigerianCurrencyFormat.format(collection.amount)}
                      </td>
                      <td>
                        {nigerianCurrencyFormat.format(collection.totalCredit)}
                      </td>
                      <td>
                        {nigerianCurrencyFormat.format(collection.balanceDue)}
                      </td>
                      <td>{collection.paymentDate}</td>
                    </tr>
                  );
                })}
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

export default CollectionNotificationTable;

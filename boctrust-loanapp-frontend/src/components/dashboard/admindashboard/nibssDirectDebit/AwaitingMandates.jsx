import React, { useEffect, useState } from "react";
import NextPreBtn from "../../shared/NextPreBtn";
import DashboardHeadline from "../../shared/DashboardHeadline";
import { Table } from "react-bootstrap";
import apiClient from "../../../../lib/axios";
import getDateOnly from "../../../../../utilities/getDate";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import capitalizeEachWord from "../../../../../utilities/capitalizeFirstLetter";
import BocButton from "../../shared/BocButton";
import { toast } from "react-toastify";
import PageLoader from "../../shared/PageLoader";
import NoResult from "../../../shared/NoResult";
import { useDebounce } from "../../../../../utilities/debounce";

const styles = {
  head: {
    color: "#fff",
  },

  padding: {
    color: "#ecaa00",
  },
  message: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#145098",
  },
  btnBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  topUp: {
    color: "#ecaa00",
    fontSize: "0.6rem",
  },
};

const AwaitingMandates = () => {
  const [canUserManage, setCanUserManage] = useState(false);

  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [mandateList, setMandateList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [selectedMandateId, setSelectedMandateId] = useState();

  const debouncedSearch = useDebounce(searchTerms, 3000);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetchLoading(true)
        let url = `/nibss?filter=awaiting`;
        if (debouncedSearch) {
          url += `&search=${debouncedSearch}`;
        }
        if (showCount) {
          url += `&limit=${showCount}`;
        }
  
        if (currentPage) {
          url += `&page=${currentPage}`;
        }
  
        const {
          data: { mandates, totalPages },
        } = await apiClient.get(url);
  
        setMandateList(mandates);
        setTotalPages(totalPages);
      } catch (error) {
        console.log(error)
      } finally{
        setIsFetchLoading(false)
      }
     
    };

    getData();
  }, [debouncedSearch, showCount, currentPage]);

  useEffect(() => {
    setCanUserManage(true);
  }, []);

  const createMandate = async (mandateId) => {
    try {
      setSelectedMandateId(mandateId);
      setIsLoading(true);
      await apiClient.post(`/nibss/debit-mandate`, {
        mandateId,
      });
      await apiClient.post(`/nibss/balance-mandate`, {
        mandateId,
      });

      toast.success("Mandates Created for Customer Loan");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went Wrong");
    } finally {
      setIsLoading(false);
      setSelectedMandateId("");
    }
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
    <div className="MainBox bookloan__container">
      {/* top search bar */}
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
            <div className="FormGroup SBox">
              <input
                name="search"
                placeholder="Search by name"
                onChange={(e) => setSearchTerms(e.target.value)}
              />
              <img src="/images/search.png" alt="search-icon" />
            </div>
          </div>
        </DashboardHeadline>
      </div>
      <div>
        {/* data loader */}

        {/* Loans list  */}
        <div className="ListSec">
          <DashboardHeadline
            height="52px"
            mspacer="2rem 0 -3.2rem -1rem"
            bgcolor="#145098"
          ></DashboardHeadline>
          <div style={styles.table}>
            <Table borderless hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>S/N</th>
                  <th>Loan Acc Number</th>
                  <th>Balance Mandate</th>
                  <th>Debit Mandate</th>
                  <th>Release Date</th>
                  <th>Applied Amount</th>

                  {canUserManage && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {!mandateList || isFetchLoading ? (
                  <td colSpan="7">
                    <PageLoader />
                  </td>
                ) : mandateList &&
                mandateList?.length === 0 ? (
                  <td colSpan="7">
                    <NoResult name="Mandate" />
                  </td>
                ) : (
                  mandateList &&
                  mandateList?.map((mandate, index) => {
                    return (
                      <tr key={mandate._id}>
                        <td>{index + 1}</td>
                        <td>{mandate?.loan?.loanAccountNumber}</td>
                        <td>
                          <div> {mandate.balanceMandate.isActive}</div>

                          <div>
                            {capitalizeEachWord(mandate.balanceMandate.status)}
                          </div>
                        </td>
                        <td>
                          <div> {mandate.debitMandate.isActive}</div>
                          <div>
                            {capitalizeEachWord(mandate.debitMandate.status)}
                          </div>
                        </td>

                        <td>{getDateOnly(mandate?.createdAt)}</td>
                        <td>
                          {nigerianCurrencyFormat.format(
                            mandate?.loan?.loanamount
                          )}
                        </td>

                        {canUserManage && (
                          <td>
                            <BocButton
                              bradius="12px"
                              fontSize="14px"
                              width="90px"
                              bgcolor="#145088"
                              disable={isLoading}
                              func={() => createMandate(mandate._id)}
                            >
                              Create
                              {selectedMandateId == mandate._id && (
                                <PageLoader width="20" />
                              )}
                            </BocButton>
                          </td>
                        )}
                      </tr>
                    );
                  })
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
    </div>
  );
};

export default AwaitingMandates;

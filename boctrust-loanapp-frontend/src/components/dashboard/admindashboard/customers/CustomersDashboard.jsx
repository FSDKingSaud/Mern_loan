import { useState } from "react";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "./Customer.css";
import CustomersList from "./CustomersList";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import NextPreBtn from "../../shared/NextPreBtn";
import KycViewDetails from "../kyc/KycViewDetails";

const CustomersDashboard = () => {
  // handle search
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const [showInfo, setShowInfo] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [totalPages, setTotalPages] = useState(1);

  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);

  return (
    <div className="MainBox">
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
      <>
        {!showInfo && (
          <div>
            {/* customers list  */}
            <div className="ListSec">
              <CustomersList
                count={showCount}
                searchTerms={searchTerms}
                setTotalPages={setTotalPages}
                currentPage={currentPage}
                setSelectedCustomer={setSelectedCustomer}
                setShowInfo={setShowInfo}
              />
            </div>
            {/* next and previous button  */}
            <NextPreBtn
              currentPage={currentPage}
              totalPages={totalPages}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
            />
          </div>
        )}

        {showInfo && (
          <KycViewDetails
            loan={selectedCustomer?.loan}
            hideLoanDetails
            customer={selectedCustomer}
            setShowInfo={setShowInfo}
          />
        )}
      </>
    </div>
  );
};

export default CustomersDashboard;

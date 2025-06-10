import { useState } from "react";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import AllLoans from "./AllLoans";
import NextPreBtn from "../../shared/NextPreBtn";

// custom hook
import usePagination from "../../../../customHooks/usePagination";

const LoanDashboard = () => {
  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
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
      <div>
        <div className="ListSec">
          {/* Loans list  */}
          <AllLoans
            count={showCount}
            searchTerms={searchTerms}
            setTotalPages={setTotalPages}
            currentPage={currentPage}
          />

          {/* next and previous button */}
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

export default LoanDashboard;

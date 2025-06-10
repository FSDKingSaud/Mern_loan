import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import BranchesList from "./BranchesList";
import AddBranch from "./AddBranch";
import NextPreBtn from "../../shared/NextPreBtn";
import handleAdminRoles from "../../../../../utilities/getAdminRoles";

// custom hook
import usePagination from "../../../../customHooks/usePagination";

const Branches = () => {
  const currentUser = useSelector((state) => state.adminAuth.user);
  const [admin, setAdmin] = useState("");
  const [adminRoles, setAdminRoles] = useState([]);

  const [openAddBranch, setOpenAddBranch] = useState(false);
  // open add branch component
  const openAddBranches = () => setOpenAddBranch(true);

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.userType === "admin" || currentUser.userType === "md") {
        setAdmin("admin");
      }

      handleAdminRoles(currentUser, setAdminRoles);
    }
  }, []);

  return (
    <>
      {!openAddBranch ? (
        <div className="MainBox">
          {admin || adminRoles?.includes("manageBranch") ? (
            <div className="AddBtn">
              <BocButton
                bgcolor="#ecaa00"
                bradius="22px"
                func={openAddBranches}
              >
                <span>+</span> Add New Branch
              </BocButton>
            </div>
          ) : null}

          {/* top search bar */}
          <div className="Search">
            <DashboardHeadline padding="0" bgcolor="#d9d9d9">
              <div className="SearchBar">
                <div className="FormGroup">
                  <label htmlFor="show">Show</label>
                  <input
                    name="showCount"
                    type="number"
                    step={5}
                    min={5}
                    value={showCount}
                    onChange={(e) => setShowCount(e.target.value)}
                  />
                </div>
                <div className="FormGroup SBox">
                  <input
                    name="search"
                    placeholder="branch name"
                    value={searchTerms}
                    onChange={(e) => setSearchTerms(e.target.value)}
                  />
                  <img src="/images/search.png" alt="search-icon" />
                </div>
              </div>
            </DashboardHeadline>
          </div>
          <div>
            {/* branches list  */}
            <div className="ListSec">
              <BranchesList
                count={showCount}
                searchTerms={searchTerms}
                setTotalPages={setTotalPages}
                currentPage={currentPage}
                admin={admin}
                adminRoles={adminRoles}
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
      ) : (
        <AddBranch func={setOpenAddBranch} />
      )}
    </>
  );
};

export default Branches;

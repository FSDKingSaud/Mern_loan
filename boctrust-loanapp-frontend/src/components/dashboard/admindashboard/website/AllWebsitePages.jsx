// import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import AllWebsiteList from "./AllWebsiteList";

const AllWebsitePages = () => {
  return (
    <>
        <div className="MainBox">
          {/* <div className="AddBtn">
            <BocButton bgcolor="#ecaa00" bradius="22px" func={openAddBranches}>
              <span>+</span> Add New Branch
            </BocButton>
          </div> */}

          {/* top search bar */}
          <div className="Search">
            <DashboardHeadline padding="0" bgcolor="#d9d9d9">
              <div className="SearchBar">
                <div className="FormGroup">
                  <label htmlFor="show">Show</label>
                  <input name="showCount" type="number" step={10} min={10} />
                </div>
                <div className="FormGroup SBox">
                  <input name="search" placeholder="Search" />
                  <img src="/images/search.png" alt="search-icon" />
                </div>
              </div>
            </DashboardHeadline>
          </div>
          <div>
            {/* branches list  */}
            <div className="ListSec">
              <AllWebsiteList />
              {/* next and previous button  */}
              <NextPreBtn />
            </div>
          </div>
        </div>
    </>
  );
};

export default AllWebsitePages;

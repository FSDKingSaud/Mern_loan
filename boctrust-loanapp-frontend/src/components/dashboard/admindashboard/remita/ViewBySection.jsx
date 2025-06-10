import PropTypes from "prop-types";
import { useState } from "react";
import Headline from "../../../shared/Headline";
import BocButton from "../../shared/BocButton";

const ViewBySection = ({
  firstBtn = "Applications Today",
  setSearch,
  setDateRange,
  dateRange,
  searchDateFunc,
  handleReload,
  printBtn,
}) => {
  const styles = {
    btnBox: {
      display: "flex",
      justifyContent: "center",
    },
    inputBox: {
      width: "40%",
      border: "1px solid #ecaa00",
      borderRadius: "25px",
      padding: "0.5rem 1rem",
      margin: "1rem",
    },
    datebox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      width: "60%",
      margin: "1rem",
    },
  };

  const [showSearchName, setShowSearchName] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  const handleSearchName = () => {
    setShowDateRange(false);
    // toggle search name input
    if (showSearchName) {
      setSearch("");
      setShowSearchName(false);
    } else {
      setShowSearchName(true);
    }
  };

  const handleShowDateRange = () => {
    setShowSearchName(false);
    // toggle search name input
    if (showDateRange) {
      setDateRange({
        fromDate: "",
        toDate: "",
      });
      setShowDateRange(false);
    } else {
      setShowDateRange(true);
    }
  };

  // handle search by date range input change
  const handleChange = (e) => {
    // update object state
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Headline text="View by:" />
      <div style={styles.btnBox} className="VBox">
        <BocButton
          margin="8px 18px"
          bgcolor="#ecaa00"
          bradius="25px"
          func={searchDateFunc}
        >
          {firstBtn}
        </BocButton>

        <BocButton
          margin="8px 18px"
          bgcolor="#ecaa00"
          bradius="25px"
          func={handleShowDateRange}
        >
          Date Range
        </BocButton>

        <BocButton
          margin="8px 18px"
          bgcolor="#ecaa00"
          bradius="25px"
          func={handleSearchName}
        >
          Specific Customer
        </BocButton>
        <BocButton
          margin="8px 18px"
          bgcolor="#ecaa00"
          bradius="25px"
          func={handleReload}
        >
          Reload
        </BocButton>

        {printBtn}
      </div>
      <div style={styles.btnBox} className="searchByBox">
        {showSearchName && (
          <input
            type="text"
            placeholder="search by name"
            style={styles.inputBox}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        {/* date range input */}
        {showDateRange && (
          <div style={styles.datebox} className="range">
            <label htmlFor="from">From</label>
            <input
              type="date"
              name="fromDate"
              style={styles.inputBox}
              onChange={handleChange}
            />

            <label htmlFor="to">To</label>
            <input
              type="date"
              name="toDate"
              style={styles.inputBox}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

ViewBySection.propTypes = {
  firstBtn: PropTypes.string,
  setSearch: PropTypes.func,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.object,
  searchDateFunc: PropTypes.func,
  handleReload: PropTypes.func,
  printBtn: PropTypes.element,
};

export default ViewBySection;

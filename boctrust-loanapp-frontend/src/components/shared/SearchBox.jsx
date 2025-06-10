import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import Headline from "./Headline";

const SearchBox = ({
  func,
  bgcolor = "#f5f5f5",
  marginTop = "-6rem",
  headlineTxt,
  width = "60%",
  placeholder = "Enter your search term here....",
}) => {
  const styles = {
    container: {
      position: "relative",
      width: width,
      padding: "1.5rem",
      marginTop: marginTop,
      backgroundColor: bgcolor,
      borderRadius: "16px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    input: {
      width: "100%",
      padding: "1rem 2rem",
      border: "none",
      outline: "none",
      fontSize: "1rem",
      borderRadius: "10px",
      backgroundColor: "#f9e2a8",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    icon: {
      position: "absolute",
      right: "3rem",
      top: "60%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "1.5rem",
    },
  };

  return (
    <div style={styles.container} className="SearchContainer">
      <Headline spacer="0 0 12px 0" fontSize="1.3rem" text={headlineTxt} />
      <input
        style={styles.input}
        type="text"
        placeholder={placeholder}
        onChange={func}
      />
      <FontAwesomeIcon icon={faSearch} style={styles.icon} />
    </div>
  );
};

SearchBox.propTypes = {
  func: PropTypes.func.isRequired,
  bgcolor: PropTypes.string,
  marginTop: PropTypes.string,
  headlineTxt: PropTypes.string.isRequired,
  width: PropTypes.string,
  placeholder: PropTypes.string,
};

export default SearchBox;

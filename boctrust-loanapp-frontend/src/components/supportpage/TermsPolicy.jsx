import { Link } from "react-router-dom";
import Headline from "../shared/Headline";
import Divider from "./Divider";
import "./Support.css";

const TermsPolicy = () => {
  const styles = {
    container: {
      color: "#fff",
      backgroundColor: "#ecaa00",
      padding: "4rem",
    },
    link: {
      color: "#fff",
      textDecoration: "none",
    },
  };

  return (
    <div className="container-fluid" style={styles.container}>
      <div className="container">
        <Headline text="Terms and Conditions" color="#fff" align="left" />
        <Divider />
        <ul>
          <li className="Tlink">
            {" "}
            <Link to="/privacy">Boctrust Mfb Privacy Policy</Link>{" "}
          </li>
          <li className="Tlink">
            {" "}
            <Link to="/terms">Boctrust Mfb Terms & Conditions</Link>{" "}
          </li>
          <li className="Tlink">
            {" "}
            <Link to="/loanterms">Boctrust Mfb Loan App Terms of use</Link>{" "}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TermsPolicy;

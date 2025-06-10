import PropTypes from "prop-types";
import PageLoader from "../../shared/PageLoader";
const LoansCard = ({ img, title, stat, bgcolor }) => {
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      height: "120px",
      padding: "1rem",
      backgroundColor: bgcolor,
      borderRadius: "10px",
    
    },
    text: {
      color: "#fff",
      fontsize: "2rem",
      fontWeight: "900px",
      textAlign: "right",
    },
  };
  return (
    <div style={styles.container} className="StatCard">
      <img src={img} alt="stat-icon" />
      <div>
        <p style={styles.text}>{title}</p>
        {stat != null ? (
          <h4 style={styles.text}>{stat}</h4>
        ) : (
          <PageLoader width="18px" />
        )}
      </div>
    </div>
  );
};

LoansCard.propTypes = {
  bgcolor: PropTypes.string,
  img: PropTypes.string,
  stat: PropTypes.any,
  title: PropTypes.string,
};

export default LoansCard;

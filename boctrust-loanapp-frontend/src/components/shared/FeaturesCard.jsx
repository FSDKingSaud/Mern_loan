import PropTypes from "prop-types";

const FeaturesCard = ({ title, description, imgsrc, icon, bgcolor = "#fff", width = "18rem" }) => {
  const styles = {
    cardStyle: {
      width: { width },
      backgroundColor: bgcolor,
      textAlign: "center",
      fontFamily: "sans-serif",
      border: "none",
      borderRadius: "15px",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    },
    iconBox: {
      width: "50px",
      height: "50px",
      borderRadius: "15%",
      backgroundColor: "#145088",
      color: "white",
      fontSize: "30px",
      margin: "0 auto",
      marginBottom: "10px",
    },
    img: {
      width: "30px",
      height: "30px",
    }
  };

  return (
    <div className="card" style={styles.cardStyle}>
      <div className="card-body">
        <div style={styles.iconBox}>{icon || <img style={styles.img} src={imgsrc } />}</div>

        <h3>{title}</h3>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
};

FeaturesCard.propTypes = {
  description: PropTypes.string,
  icon: PropTypes.any,
  title: PropTypes.string,
  width: PropTypes.string,
  bgcolor: PropTypes.string,
  imgsrc: PropTypes.string,
};

export default FeaturesCard;

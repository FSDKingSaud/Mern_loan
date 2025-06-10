import PropTypes from "prop-types";

const LoanCard = ({
  title,
  description,
  imgsrc,
  icon,
  bgcolor = "#145088",
  cname,
  width = "18rem",
}) => {
  const styles = {
    cardStyle: {
      width: { width },
      minHeight: "350px",
      backgroundColor: bgcolor,
      textAlign: "center",
      fontFamily: "sans-serif",
      fontSize: "1.2rem",
      border: "none",
      borderRadius: "15px",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      margin: "18px 6px",
      padding: "14px 24px",
    },
    iconBox: {
      width: "60px",
      height: "65px",
      borderRadius: "15%",
      backgroundColor: "#fff",
      color: "white",
      fontSize: "40px",
      margin: "0 auto",
      marginBottom: "10px",
    },
    img: {
      width: "40px",
      height: "40px",
    },
    p: {
      color: "#fff",
    },
  };

  console.log(title)
  return (
    <div className="card" style={styles.cardStyle}>
      <div className="card-body">
        {imgsrc ? (
          <div style={styles.iconBox}>
            {icon || <img style={styles.img} src={imgsrc} />}
          </div>
        ) : (
          <div></div>
        )}

        <h3>{title}</h3>
        <p style={styles.p} className={cname}>
          {description}
        </p>
      </div>
    </div>
  );
};

LoanCard.propTypes = {
  bgcolor: PropTypes.string,
  description: PropTypes.any,
  icon: PropTypes.any,
  imgsrc: PropTypes.any,
  title: PropTypes.string,
  width: PropTypes.string,
  color: PropTypes.string,
  cname: PropTypes.string,
};

export default LoanCard;

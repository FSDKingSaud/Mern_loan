import PropTypes from "prop-types";

const NextPreBtn = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
}) => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "flex-end",
    },
    btnBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "19px",
    },
    btn: {
      padding: "5px 15px",
      border: "none",
      backgroundColor: "#145098",
      color: "#fff",
      cursor: "pointer",
    },
    img: {
      width: "20px",
      height: "20px",
    },
    p: {
      padding: "0 20px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.btnBox}>
        <button
          style={styles.btn}
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <img style={styles.img} src="/images/arrowleft.png" alt="prev" />
        </button>
        <p style={styles.p}>{`Page ${currentPage} of ${totalPages}`}</p>
        <button
          style={styles.btn}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <img style={styles.img} src="/images/arrowright.png" alt="next" />
        </button>
      </div>
    </div>
  );
};

NextPreBtn.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  goToNextPage: PropTypes.func.isRequired,
  goToPreviousPage: PropTypes.func.isRequired,
};

export default NextPreBtn;

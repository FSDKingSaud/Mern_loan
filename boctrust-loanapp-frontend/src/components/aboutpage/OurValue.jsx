import PropTypes from "prop-types"
import Headline from "../shared/Headline";

const OurValue = ({ values }) => {
  const styles = {
    container: {
      backgroundColor: "#ecaa00",
      color: "#fff",
      padding: "50px 0",
    },
    value: {
      paddingLeft: "2rem",
    },
    text: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      lineHeight: "1.5",
      textAlign: "left",
      letterSpacing: "0.5px",
    },
  };

  return (
    <div style={styles.container} className="container-fluid">
      <Headline text="Our Values" color="#fff" />
      <div className="container">
        <div className="row OurValue" style={styles.value}>
          {values?.map((value) => (
            <div className={`col-md-6 col-sm-12 px-5`} key={value._id}>
              <div>
                <Headline
                  text={value.title}
                  color="#fff"
                  fontSize="22px"
                  align="left"
                />
                <p style={styles.text}>{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

OurValue.propTypes = {
  values: PropTypes.shape({
    map: PropTypes.func
  })
}

export default OurValue;

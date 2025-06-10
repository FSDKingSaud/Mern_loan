import PropTypes from "prop-types"
import Headline from "../../shared/Headline";

const TestimonialCard = ({ img = "/images/avater.jpg", name, text, career }) => {
  const styles = {
    cardStyle: {
      width: "350px",
      minWidth: "300px",
      minHeight: "300px",
      padding: "38px",
      margin: "8px",
      borderRadius: "8px",
      backgroundColor: "#fff",
      fontSize: "1.2rem",
      fontWeight: "500",
    },

    img: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      backgroundColor: "#000",
      border: "2px solid #ecaa00",
    },

    profile: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    },
  };

  return (
    <div style={styles.cardStyle} className="TestimonialCard">
      <p>
        “{text}” <span style={{ color: "#145088" }}>read more</span>
      </p>
      <div style={styles.profile} className="ProfileCard">
        <img src={img} alt={name} style={styles.img} />
        <div>
          <Headline spacer="0" fontSize="22px" text={name} />
          <p>{career}</p>
        </div>
      </div>
    </div>
  );
};

TestimonialCard.propTypes = {
  career: PropTypes.string,
  img: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
}

export default TestimonialCard;

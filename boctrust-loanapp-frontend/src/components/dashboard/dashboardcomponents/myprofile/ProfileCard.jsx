import PropTypes from "prop-types";
const ProfileCard = ({ title, value }) => {
  const styles = {
    container: {
      backgroundColor: "#fff",
      padding: "0.3rem 2rem 0 2rem",
      marginTop: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.05)",
    },
    text1: {
      color: "grey",
    },
    text2: {
      fontWeight: "900",
      fontSize: "1.2rem",
    },
  };
  return (
    <div style={styles.container} className="ProfileCon">
      <p style={styles.text1}>{title}</p>
      <p style={styles.text2}>{value}</p>
    </div>
  );
};

ProfileCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};

export default ProfileCard;

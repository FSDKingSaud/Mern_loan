import PropTypes from "prop-types";
import "./Remita.css";

const DetailsCard = ({title, text}) => {
    const styles = {
        container: {
            margin: "1.9rem 4rem ",
        },
        title: {
            paddingLeft: "0.7rem",
            marginBottom: "0.5rem",
        },
        text: {
            backgroundColor: "#fff",
            padding: "0.7rem",
            fontSize: "1rem",
            color: "#145098",
            borderRadius: "5px",
            fontWeight: "bold",

        }
    }
  return (
      <div style={styles.container} className="DCard">
          <p style={styles.title}>{ title}</p>
          <p style={styles.text}>{text}</p>
    </div>
  )
}

DetailsCard.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string
}

export default DetailsCard
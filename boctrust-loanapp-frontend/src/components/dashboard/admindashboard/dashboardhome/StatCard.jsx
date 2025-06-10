import PropTypes from "prop-types";
import styles from "./StarCard.module.css"


const StatCard = ({ day, date, stat, datecolor }) => {
 
  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <p style={styles.day}>{day}</p>
        <p style={styles.date}>{date}</p>
      </div>
      <p style={styles.stat}>{stat}</p>
    </div>
  );
};

StatCard.propTypes = {
  date: PropTypes.string,
  day: PropTypes.string,
  stat: PropTypes.string,
  datecolor: PropTypes.string,
};

export default StatCard;

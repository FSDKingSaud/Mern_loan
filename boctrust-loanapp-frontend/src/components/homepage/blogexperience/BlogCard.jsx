import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const BlogCard = ({
  title = "Budget your way to success",
  blogImg,
}) => {
  const shortTitle = title.substring(0, 40) + "...";
  //   styles
  const styles = {
    card: {
      width: "28rem",
      height: "30rem",
      margin: "1rem",
      padding: "1rem",
      borderRadius: "18px",
      border: "2px solid #1a237e",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      backgroundImage: `url(${blogImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },

    blogTitle: {
      position: "relative",
      bottom: "0",
      top: "24rem",
      backgroundColor: "#ecaa00",
      color: "#fff",
      padding: "0.5rem",
      borderRadius: "28px",
      textAlign: "center",
      fontSize: "1.5rem",
      textDecoration: "none",
    },
  };
  return (
    <div style={styles.card}>
      <Link to="/blogs" style={styles.blogTitle}>{shortTitle}</Link>
    </div>
  );
};

BlogCard.propTypes = {
  blogImg: PropTypes.string,
  title: PropTypes.string,
};

export default BlogCard;

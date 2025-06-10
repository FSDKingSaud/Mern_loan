import PropTypes from "prop-types";

const Header = ({ imgurl }) => {
  const styles = {
    header: {
      minWidth: "100%",
      height: "700px",
      backgroundImage: `url(${imgurl})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  };

  return <div className="container-fluid" style={styles.header}></div>;
};

Header.propTypes = {
  imgurl: PropTypes.string,
};

export default Header;

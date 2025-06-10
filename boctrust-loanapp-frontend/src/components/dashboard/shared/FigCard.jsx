import PropTypes from "prop-types";
const FigCard = ({ classname, func, children }) => {
  const style = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minWidth: "200px",
    height: "100%",
    padding: "20px",
    paddingTop: "50px",
    borderRadius: "18px",
    color: "#fff",
    background: "linear-gradient(to bottom, #48A7FF, #145098)",
  };
  return <div className={classname } style={style} onClick={func}>{children}</div>;
};

FigCard.propTypes = {
  children: PropTypes.any,
  classname: PropTypes.string,
  func: PropTypes.func,
};

export default FigCard;

import PropTypes from "prop-types";
const TopCard = ({ className, title, text, width, spacer, height, size, lineHeight, letterSpacing, padding = "18px 28px", align = "center" }) => {
  const style = {
    width: width,
    height: height,
    minHeight: "270px",
    background: "#FFFFFF",
    borderRadius: "18px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    padding: padding,
    margin: spacer,
    textAlign: align,
    fontSize: size,
    lineHeight: lineHeight,
    letterSpacing: letterSpacing,
  };
  return (
    <div style={style} className={className}> 
      {title}
      <p>{text}</p>
    </div>
  );
};

TopCard.propTypes = {
  text: PropTypes.string,
  title: PropTypes.object,
  width: PropTypes.string,
  spacer: PropTypes.string,
  height: PropTypes.string,
  size: PropTypes.string,
  lineHeight: PropTypes.string,
  letterSpacing: PropTypes.string,
  padding: PropTypes.string,
  align: PropTypes.string,
  className: PropTypes.string,
};

export default TopCard;

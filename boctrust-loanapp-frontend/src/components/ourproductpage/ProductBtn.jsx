import PropTypes from "prop-types";

const ProductBtn = ({ func, text="Add Button Text", bgcolor = "#fff", color = "593d0e" }) => {
    const btnStyle = {
        backgroundColor: bgcolor,
        color: color,
        border: "none",
        padding: "16px 20px",
        margin: "10px 0",
        width: "100%",
        borderRadius: "18px",
        fontSize: "24px",
        lineHeight: "24px",
        letterSpacing: "0.02em",
        fontWeight: "bold",
        cursor: "pointer",
    }
    return <button className="BtnProduct" onClick={func} style={btnStyle}>{ text}</button>;
}

ProductBtn.propTypes = {
  bgcolor: PropTypes.string,
  color: PropTypes.string,
  func: PropTypes.func,
  text: PropTypes.string,
}

export default ProductBtn;

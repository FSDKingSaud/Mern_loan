
import PropTypes from "prop-types"
const ProductImage = ({ url, altText }) => {
  const style = {
        marginTop: "-60px",
        width: "100%",
        height: "auto",
        borderRadius: "18px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    }
    
  return (
      <img style={style } src={url} alt={altText } />
  )
}

ProductImage.propTypes = {
  altText: PropTypes.string,
  url: PropTypes.string,
}

export default ProductImage;
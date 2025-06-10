import PropTypes from "prop-types";

const ProductListCard = ({ li }) => {
  const style = {
    listStyleType: "square",
  }
  return (
    <div>
      <ul>
        <li style={style}>{li}</li>
      </ul>
    </div>
  );
};

ProductListCard.propTypes = {
  li: PropTypes.string,
};

export default ProductListCard;

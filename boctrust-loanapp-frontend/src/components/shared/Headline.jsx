/** @jsxImportSource @emotion/react */
import PropTypes from "prop-types";
import { css } from "@emotion/react";

const Headline = ({
  text = "Pass New Title",
  color = "#145088",
  fontSize = "26px",
  fontWeight = "700",
  align = "left",
  spacer = "20px 0",
}) => {
  const headlineStyle = css`
    color: ${color};
    font-size: ${fontSize};
    font-weight: ${fontWeight};
    text-align: ${align};
    margin: ${spacer};

    @media (max-width: 600px) {
      font-size: 18px; 
    }

    @media (max-width: 1024px) {
      font-size: 22px; 
    }
  `;

  return <h3 css={headlineStyle}>{text}</h3>;
};


Headline.propTypes = {
  text: PropTypes.string,
  align: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.string,
  spacer: PropTypes.string,
};

export default Headline;


/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const NoResult = ({ name }) => {
  const style = css`
    text-align: center;
    color: #145098;
    font-size: 1.5rem;
    padding-top: 2rem;
    width: 100%;
   

    @media (max-width: 600px) {
      font-size: 1rem;
    }
  `;

  return <div  css={style}>No {name} found!</div>;
};

NoResult.propTypes = {
  name: PropTypes.string,
};

export default NoResult;

/** @jsxImportSource @emotion/react */
import PropTypes from "prop-types";
import { css } from "@emotion/react";

const DashboardHeadline = ({
  height,
  fontSize = "1.6rem",
  padding = "0.7rem",
  mspacer = "2rem 0 1rem 0",
  bgcolor = "#636363",
  children,
}) => {


  const style = css`
    font-size: ${fontSize};
    font-weight: bold;
    color: #fff;
    text-align: center;
    margin: ${mspacer};
    padding: ${padding};
    height: ${height};
    border-radius: 2rem;
    background-color: ${bgcolor};
    overflow-x: auto;
      @media (max-width: 600px) {
        font-size: 18px; 
      }

  
  `;
  return (
    <div css={style} className="DashHeader">
      {children}
    </div>
  );
};

DashboardHeadline.propTypes = {
  children: PropTypes.any,
  bgcolor: PropTypes.string,
  mspacer: PropTypes.string,
  height: PropTypes.string,
  padding: PropTypes.string,
  fontSize: PropTypes.string,
};

export default DashboardHeadline;

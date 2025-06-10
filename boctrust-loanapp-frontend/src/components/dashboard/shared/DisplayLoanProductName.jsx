import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "./PageLoader";
import PropTypes from "prop-types";
import {  fetchSelectedProduct } from "../../../redux/reducers/productReducer";

const DisplayLoanProductName = ({ loan }) => {

  const dispatch = useDispatch();

  const loanProducts = useSelector((state) => state.productReducer.products);
 
  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchSelectedProduct());
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);



  return (
    <>
      {loanProducts ? (
        loanProducts?.find(
          (item) =>
            item._id === loan?.customer?.loanproduct ||
            loan?.loanproduct
        )?.productTitle || "General Loan"
      ) : (
        <PageLoader width="20px" />
      )}
    </>
  );
};

DisplayLoanProductName.propTypes = {
  loan: PropTypes.object,
};

export default DisplayLoanProductName;

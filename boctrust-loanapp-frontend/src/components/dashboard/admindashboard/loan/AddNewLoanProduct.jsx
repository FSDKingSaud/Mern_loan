import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../redux/reducers/productReducer";
import { toast } from "react-toastify";
import apiClient from "../../../../lib/axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  productCode: Yup.string().required("Product code is required"),
  interestRate: Yup.string().required("Interest Rate is required"),
  productTitle: Yup.string(),
  // productImage: Yup.string().required("Product image is required"),
  // benefits: Yup.string().required("Benefits is required"),
  // features: Yup.string().required("Features is required"),
  // interestRate: Yup.number().required("Interest rate is required"),
  // interestType: Yup.string().required("Interest type is required"),
  // maxTerm: Yup.string().required("Max term is required"),
  // termPeriod: Yup.string().required("Term period is required"),
  // note: Yup.string().required("Note is required"),
});

const initialValues = {
  productCode: "",
  productTitle: "",
  interestRate: "",
  // category: "",
  // productImage: "",
  // benefits: "",
  // features: "",
  // interestRate: "",
  // interestType: "",
  // maxTerm: "",
  // termPeriod: "",
  // note: "",
};

const AddNewLoanProduct = ({ func }) => {
  const [notification, setNotification] = useState("");
  const [isTitleDisabled, setIsTitleDisabled] = useState(false);

  const loanProducts = useSelector((state) => state.productReducer.products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      

      // send form data to server
      await apiClient.post(`/product/products`, {
        productCode: values.productCode,
        productTitle: values.productTitle,
        interestRate: values.interestRate,
      });

      // set open add branch component to true
      // func(false);
      setSubmitting(false);
      resetForm();

      setNotification("Product added successfully");
      toast.success("Product added successfully");

      // set notification to disappear after 5 seconds
      setTimeout(() => {
        setNotification("");
      }, 5000);
    } catch (errorPayld) {
      toast.error(errorPayld.response.data.error ?? errorPayld.message);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (isTitleDisabled) {
      const selectedProduct = getSelectLoanProduct();
      selectedProduct &&
        formik.setFieldValue("productTitle", selectedProduct?.ProductName);
    }
  }, [formik.values.productCode]);

  const getSelectLoanProduct = () => {
    return (
      loanProducts &&
      loanProducts.find((p) => {
        return p.ProductCode == formik.values.productCode;
      })
    );
  };

  return (
    <div className="TransContainer">
      <DashboardHeadline>New Loan Product</DashboardHeadline>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div className="FieldRow">
          <div className="FieldGroup">
            <label htmlFor="productName">Product</label>
            <select
              name="productCode"
              onChange={formik.handleChange}
              value={formik.values.productCode}
            >
              {loanProducts &&
                loanProducts?.map((product) => (
                  <option
                    key={product?.ProductCode}
                    value={product?.ProductCode}
                  >
                    {product.ProductName}
                  </option>
                ))}
            </select>
            {formik.errors.productCode && formik.touched.productCode ? (
              <div className="Error">{formik.errors.productCode}</div>
            ) : null}
          </div>

          {/* <div className="FieldGroup">
            <label htmlFor="category">Category </label>
            <input
              type="text"
              name="category"
              id="category"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.category}
            />
            {formik.errors.category && formik.touched.category ? (
              <div className="Error">{formik.errors.category}</div>
            ) : null}
          </div> */}
        </div>

        <div className="FieldRow">
          <div className="FieldGroup">
            <label htmlFor="productTitle">Product Title</label>
            <input
              type="text"
              name="productTitle"
              id="productTitle"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.productTitle}
              disabled={isTitleDisabled}
            />
            {formik.errors.productTitle && formik.touched.productTitle ? (
              <div className="Error">{formik.errors.productTitle}</div>
            ) : null}
            <div className="d-flex align-items-center gap-2 text-muted">
              <input
                style={{
                  height: "fit-content",
                  margin: 0,
                }}
                type="checkbox"
                checked={isTitleDisabled}
                onChange={(e) => {
                  if (e.target.checked) {
                    const selectedProduct = getSelectLoanProduct();

                    if (selectedProduct) {
                      setIsTitleDisabled(e.target.checked);
                      formik.setFieldValue(
                        "productTitle",
                        selectedProduct?.ProductName
                      );
                    } else if (!selectedProduct) {
                      toast.error("No Product Selected");
                    }
                  } else {
                    setIsTitleDisabled(e.target.checked);
                  }
                }}
              />
              Use Defualt Name Instead
            </div>
          </div>

          <div className="FieldGroup">
            <label htmlFor="interestRate">Annual Interest Rate </label>
            <input
              type="text"
              name="interestRate"
              id="interestRate"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.interestRate}
            />
            {formik.errors.interestRate && formik.touched.interestRate ? (
              <div className="Error">{formik.errors.interestRate}</div>
            ) : null}
            <div className="text-success">
              E.g: Enter '10' for interest rate of 10%
            </div>
          </div>
        </div>

        {/* <div className="FieldRow">
          <div className="FieldGroup">
            <label htmlFor="interestRate">Interest Rate</label>
            <input
              type="number"
              name="interestRate"
              id="interestRate"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.interestRate}
            />
            {formik.errors.interestRate && formik.touched.interestRate ? (
              <div className="Error">{formik.errors.interestRate}</div>
            ) : null}
          </div>

          <div className="FieldGroup">
            <label htmlFor="interestType">Interest Type </label>
            <input
              type="text"
              name="interestType"
              id="interestType"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.interestType}
            />
            {formik.errors.interestType && formik.touched.interestType ? (
              <div className="Error">{formik.errors.interestType}</div>
            ) : null}
          </div>
        </div>

        <div className="FieldRow">
          <div className="FieldGroup">
            <label htmlFor="maxTerm">Maximum Term</label>
            <input
              type="text"
              name="maxTerm"
              id="maxTerm"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.maxTerm}
            />
            {formik.errors.maxTerm && formik.touched.maxTerm ? (
              <div className="Error">{formik.errors.maxTerm}</div>
            ) : null}
          </div>

          <div className="FieldGroup">
            <label htmlFor="termPeriod">Term Period </label>
            <input
              type="text"
              name="termPeriod"
              id="termPeriod"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.termPeriod}
            />
            {formik.errors.termPeriod && formik.touched.termPeriod ? (
              <div className="Error">{formik.errors.termPeriod}</div>
            ) : null}
          </div>
        </div>

        <div className="FieldRow">
          <div className="FieldGroup IUpload">
            <label htmlFor="productImage">Featured Image</label>
            <input
              type="file"
              name="productImage"
              id="productImage"
              className="Input"
              onChange={(event) => {
                formik.setFieldValue(
                  "productImage",
                  event.currentTarget.files[0]
                );
              }}
              // accept="image/*"
              style={{ paddingBottom: "38px", fontSize: "12px" }}
            />
            {formik.errors.productImage && formik.touched.productImage ? (
              <div className="Error">{formik.errors.productImage}</div>
            ) : null}
          </div>

          <div className="FieldGroup">
            <label htmlFor="note">Note</label>
            <input
              type="text"
              name="note"
              id="note"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.note}
            />
            {formik.errors.note && formik.touched.note ? (
              <div className="Error">{formik.errors.note}</div>
            ) : null}
          </div>
        </div> */}

        <div className="Notification">
          <p>{notification}</p>
        </div>

        <div className="BtnContainer">
          <BocButton
            type="submit"
            width="220px"
            bgcolor="#ecaa00"
            bradius="18px"
          >
            Submit
          </BocButton>
          <BocButton
            margin="1.5rem 0 0 0"
            type="submit"
            width="220px"
            bgcolor="gray"
            bradius="18px"
            func={() => func(false)}
          >
            Cancel
          </BocButton>
        </div>
      </form>
    </div>
  );
};

AddNewLoanProduct.propTypes = {
  func: PropTypes.func,
};

export default AddNewLoanProduct;

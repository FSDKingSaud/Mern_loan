import { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import apiClient from "../../../../lib/axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  methodName: Yup.string().required("Required"),
  logo: Yup.string().required("Required"),
});

const initialValues = {
  methodName: "",
  logo: "",
};

const AddNewWithdrawerMethod = ({ func }) => {
  const [notification, setNotification] = useState("");

  const handleSubmit = async (values, { resetForm }
    
  ) => {
    // Handle form submission logic here
    const formData = new FormData();
    formData.append("methodName", values.methodName);
    formData.append("logo", values.logo);

    await apiClient.post(`/disbursement/disbursements`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    resetForm();
    setNotification("Method added successfully");

    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleClose = () => {
    func(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="TransContainer">
      <DashboardHeadline>Add New Method</DashboardHeadline>
      <form onSubmit={formik.handleSubmit}>
        <div className="FieldRow">
          <div className="FieldGroup">
            <label htmlFor="methodName">Method Name</label>
            <input
              type="text"
              name="methodName"
              id="methodName"
              className="Input"
              onChange={formik.handleChange}
              value={formik.values.methodName}
            />
            {formik.errors.methodName && formik.touched.methodName ? (
              <div className="Error">{formik.errors.methodName}</div>
            ) : null}
          </div>
          <div className="FieldGroup IUpload">
            <label htmlFor="logo">Image Logo</label>
            <input
              type="file"
              name="logo"
              id="logo"
              className="Input"
              onChange={(event) => {
                formik.setFieldValue("logo", event.currentTarget.files[0]);
              }}
              style={{ paddingBottom: "38px", fontSize: "12px" }}
            />
            {formik.errors.logo && formik.touched.logo ? (
              <div className="Error">{formik.errors.logo}</div>
            ) : null}
          </div>
        </div>
        <div className="Notification">
          <p>{notification}</p>
        </div>

        <div className="BtnRow">
          <div className="BtnContainer">
            <BocButton
              fontSize="1.6rem"
              type="button"
              bgcolor="gray"
              bradius="18px"
              func={handleClose}
            >
              Cancel
            </BocButton>
          </div>
          <div className="BtnContainer">
            <BocButton
              fontSize="1.6rem"
              type="submit"
              bgcolor="#ecaa00"
              bradius="18px"
            >
              Submit
            </BocButton>
          </div>
        </div>
      </form>
    </div>
  );
};

AddNewWithdrawerMethod.propTypes = {
  func: PropTypes.func,
};

export default AddNewWithdrawerMethod;

import { Formik, Form, Field, ErrorMessage } from "formik";
import validationSchema from "./validationSchema";
import initialValues from "./initialValues";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";

const AddCustomer = () => {
  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log(values);
  };

  return (
    <div className="TransContainer">
      <DashboardHeadline>New Customer Form </DashboardHeadline>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="firstName">First Name</label>
              <Field type="text" name="firstName" className="Input" />
              <ErrorMessage name="firstName" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="lastName">Last Name</label>
              <Field type="text" name="lastName" className="Input" />
              <ErrorMessage name="lastName" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="gender">Gender</label>
              <Field type="text" name="gender" className="Input" />
              <ErrorMessage name="gender" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="dob">Date of Birth</label>
              <Field type="date" name="dob" className="Input" />
              <ErrorMessage name="dob" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="phone">Phone Number</label>
              <Field type="tel" name="phone" className="Input" />
              <ErrorMessage name="phone" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="email">Email Address</label>
              <Field type="text" name="email" className="Input" />
              <ErrorMessage name="email" component="div" />
            </div>
          </div>

          <div className="FieldGroup IAddress" style={{ margin: "0 2rem" }}>
            <label htmlFor="address">Customer Address</label>
            <Field
              type="text"
              name="address"
              className="Input"
              style={{ width: "100%" }}
            />
            <ErrorMessage name="address" component="div" />
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="stateOfOrigin">State of Origin</label>
              <Field type="text" name="stateOfOrigin" className="Input" />
              <ErrorMessage name="stateOfOrigin" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="stateOfResidence">State of Residence</label>
              <Field type="text" name="stateOfResidence" className="Input" />
              <ErrorMessage name="stateOfResidence" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="lga">LGA of Residence</label>
              <Field type="text" name="lga" className="Input" />
              <ErrorMessage name="lga" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="city">City of Residence</label>
              <Field type="text" name="city" className="Input" />
              <ErrorMessage name="city" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="maritalStatus">Marital Status</label>
              <Field type="text" name="maritalStatus" className="Input" />
              <ErrorMessage name="maritalStatus" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="occupation">Occupation</label>
              <Field type="text" name="occupation" className="Input" />
              <ErrorMessage name="occupation" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="username">Username</label>
              <Field type="text" name="username" className="Input" />
              <ErrorMessage name="username" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="Input" />
              <ErrorMessage name="password" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div
              className="FieldGroup IUpload"
              style={{
                paddingLeft: "3rem",
                paddingRight: "2rem",
                width: "500px",
              }}
            >
              <label htmlFor="photo">Upload Photo</label>
              <Field type="file" name="photo" />
              <ErrorMessage name="photo" component="div" />
            </div>

            <div
              className="FieldGroup IUpload"
              style={{ paddingRight: "6.6rem", width: "500px" }}
            >
              <label htmlFor="idCard">Upload ID Card</label>
              <Field type="file" name="idCard" className="FileUploan" />
              <ErrorMessage name="idCard" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="branch">Branch</label>
              <Field type="text" name="branch" className="Input" />
              <ErrorMessage name="branch" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="loanOfficer">Loan Officer</label>
              <Field type="text" name="loanOfficer" className="Input" />
              <ErrorMessage name="loanOfficer" component="div" />
            </div>
          </div>

          {/* <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="duration">Duration</label>
              <Field
                type="text"
                name="duration"
                id="duration"
                className="Input"
              />
              <ErrorMessage name="duration" component="div" />
            </div>
            <div className="FieldGroup">
              <label htmlFor="loanProduct">Loan Product</label>
              <Field
                as="select"
                name="loanProduct"
                id="loanProduct"
                className="Select"
              >
                <option value="" label="Select a product" />
                {loanProductOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </Field>
              <ErrorMessage name="loanProduct" component="div" />
            </div>
          </div> */}

          <div className="BtnContainer">
            <BocButton
              type="submit"
              bgcolor="#ecaa00"
              bradius="18px"
            >
              Add New Customer
            </BocButton>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default AddCustomer;

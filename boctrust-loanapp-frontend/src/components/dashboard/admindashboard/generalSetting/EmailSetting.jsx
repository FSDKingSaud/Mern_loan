import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "../../../../redux/reducers/settingReducer";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import PageLoader from "../../shared/PageLoader";
import updateSettings from "./updateSetting";
import { toast } from "react-toastify";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  mailType: Yup.string().required("Mail type is required"),
  fromEmail: Yup.string().required("From email is required"),
  fromName: Yup.string().required("From name is required"),
  smtpPort: Yup.string().required("SMPT port is required"),
  smptHost: Yup.string().required("SMPT host is required"),
  smtpUsername: Yup.string().required("SMPT username is required"),
});

const EmailSetting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    mailType: "",
    fromEmail: "",
    fromName: "",
    smptHost: "",
    smtpPort: "",
    smtpUsername: "",
  });

  const dispatch = useDispatch();
  const settings = useSelector(
    (state) => state.settingReducer?.settings.settings
  );
  const status = useSelector((state) => state.settingReducer.status);

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      const {
        mailType,
        fromEmail,
        fromName,
        smptHost,
        smtpPort,
        smtpUsername,
      } = settings;

      setInitialValues({
        mailType: mailType || "",
        fromEmail: fromEmail || "",
        fromName: fromName || "",
        smptHost: smptHost || "",
        smtpPort: smtpPort || "",
        smtpUsername: smtpUsername || "",
      });
    }
  }, []);

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      // Handle form submission logic here
      const data = {
        mailType: values.mailType,
        fromEmail: values.fromEmail,
        fromName: values.fromName,
        smptHost: values.smptHost,
        smtpPort: values.smtpPort,
        smtpUsername: values.smtpUsername,
      };

      await updateSettings(data, "email");

      toast.success("Email Settings updated successfully");

      //  resetForm();
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="TransContainer">
      {status === "loading" ? (
        <PageLoader />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur }) => {
            return (
              <Form>
                <div className="FieldRow">
                  <div className="FieldGroup">
                    <label htmlFor="mailType">Mail Type</label>

                    <Field
                      as="select"
                      name="mailType"
                      id="mailType"
                      className="Select"
                    >
                      <option value="" label="Select a Type" />
                      {["SMTP"].map((option) => (
                        <option key={option} value={option} label={option} />
                      ))}
                    </Field>
                    <ErrorMessage
                      className="error__msg"
                      name="mailType"
                      component="div"
                    />
                  </div>
                  <div className="FieldGroup">
                    <label htmlFor="fromEmail">From Email</label>
                    <Field
                      type="text"
                      name="fromEmail"
                      id="fromEmail"
                      className="Input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      className="error__msg"
                      name="fromEmail"
                      component="div"
                    />
                  </div>
                </div>

                <div className="FieldRow">
                  <div className="FieldGroup">
                    <label htmlFor="fromEmail">From Name</label>
                    <Field
                      type="text"
                      name="fromName"
                      id="fromName"
                      className="Input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      className="error__msg"
                      name="fromName"
                      component="div"
                    />
                  </div>
                  <div className="FieldGroup">
                    <label htmlFor="smptHost">SMPT Host</label>
                    <Field
                      type="text"
                      name="smptHost"
                      id="smptHost"
                      className="Input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      className="error__msg"
                      name="smptHost"
                      component="div"
                    />
                  </div>
                </div>
                <div className="FieldRow">
                  <div className="FieldGroup">
                    <label htmlFor="smtpPort">SMPT Port</label>
                    <Field
                      type="text"
                      name="smtpPort"
                      id="smtpPort"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="Input"
                    />
                    <ErrorMessage
                      className="error__msg"
                      name="smtpPort"
                      component="div"
                    />
                  </div>
                  <div className="FieldGroup">
                    <label htmlFor="smtpUsername">SMPT Username</label>
                    <Field
                      type="text"
                      name="smtpUsername"
                      id="smtpUsername"
                      className="Input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      className="error__msg"
                      name="smtpUsername"
                      component="div"
                    />
                  </div>
                </div>

                <div className="BtnContainer">
                  <BocButton
                    type="submit"
                    width="220px"
                    bgcolor="#ecaa00"
                    bradius="18px"
                  >
                    Save Settings{" "}
                    {isLoading && (
                      <PageLoader strokeColor="#145088" width="20px" />
                    )}
                  </BocButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default EmailSetting;

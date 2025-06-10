import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "../../../../redux/reducers/settingReducer";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import PageLoader from "../../shared/PageLoader";
import updateSettings from "./updateSetting";
import { fetchAllLoanOfficers } from "../../../../redux/reducers/loanOfficerReducer";
import apiClient from "../../../../lib/axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_BASE_URL;

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  siteTitle: Yup.string().required("Site title is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber1: Yup.string().required("Phone number is required"),
  phoneNumber2: Yup.string().required("Phone number is required"),
  email: Yup.string().required("Email is required"),
  copyrightText: Yup.string().required("Copyright is required"),
  // top up update
  topUpEligibilityMonths: Yup.number()
    .min(1, "Must be at least 1 month")
    .required("Top-Up Eligibility Months is required"),
});

const MAX_FILE_SIZE = 100 * 1024;

const witnessValidationSchema = Yup.object().shape({
  mandateWitnessName: Yup.string().required(" required"),
  mandateWitnessAddress: Yup.string().required("required"),
  mandateWitnessOcupation: Yup.string().required("required"),
  mandateWitnessSignature: Yup.mixed()
    .required("Photo is required ()")
    .test("fileSize", "File size exceeds 100KB", (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    }),
});

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state) => state?.settingReducer?.settings?.settings
  );
  const { allLoanOfficers } = useSelector((state) => state.loanOfficerReducer);
  const status = useSelector((state) => state.settingReducer.status);
  const [settingData, setSettingData] = useState({});
  const [rows, setRows] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processingWitnessInfo, setProcessingWitnessInfo] = useState(false);
  const [selectedLoanOfficer, setSelectedLoanOfficer] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchSetting());
      await dispatch(fetchAllLoanOfficers());
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    // Update settings state
    if (settings) {
      setSettingData(settings);
    } else {
      setSettingData({});
    }
  }, [settings]);

  useEffect(() => {
    const initializeLoanOfficers = async () => {
      // Fetch selected loan officers
      const res = await fetch(`${apiUrl}/api/admin/getSelectedLoanOfficers`);
      const result = await res.json();

      const selectedLoanOfficers = result.SelectedLoanOfficers || [];

      // Update rows with selected state
      setRows(
        allLoanOfficers?.map((row) => ({
          ...row,
          selected: selectedLoanOfficers.includes(row.Name),
        })) || []
      );

      setSelectedLoanOfficer(selectedLoanOfficers);
    };

    if (allLoanOfficers) {
      initializeLoanOfficers();
    }
  }, [allLoanOfficers]);

  const {
    siteTitle,
    address,
    phoneNumber1,
    phoneNumber2,
    email,
    copyrightText,
    mandateWitnessName,
    mandateWitnessAddress,
    mandateWitnessOcupation,
    mandateWitnessSignature,
  } = settingData;

  const initialValues = {
    siteTitle: siteTitle || "",
    address: address || "",
    phoneNumber1: phoneNumber1 || "",
    phoneNumber2: phoneNumber2 || "",
    email: email || "",
    copyrightText: copyrightText || "",
    topUpEligibilityMonths: settingData.topUpEligibilityMonths || 6, // Default value
  };

  const initialWitnessValues = {
    mandateWitnessName: mandateWitnessName || "",
    mandateWitnessAddress: mandateWitnessAddress || "",
    mandateWitnessOcupation: mandateWitnessOcupation || "",
    mandateWitnessSignature: mandateWitnessSignature || "",
  };

  const handleSubmit = async (values) => {
    setProcessing(true);

    try {
      const data = {
        siteTitle: values.siteTitle,
        address: values.address,
        phoneNumber1: values.phoneNumber1,
        phoneNumber2: values.phoneNumber2,
        email: values.email,
        copyrightText: values.copyrightText,
      };

      const response = await updateSettings(data, "general");

      if (response) {
        setSuccessMsg("Settings updated successfully");
        setProcessing(false);
      } else {
        setSuccessMsg("Error updating settings");
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  // Handle checkbox change for a specific row
  const handleCheckboxChange = (Code) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.Code === Code ? { ...row, selected: !row.selected } : row
      )
    );
  };

  // Select or deselect all rows
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setRows((prevRows) =>
      prevRows.map((row) => ({ ...row, selected: isChecked }))
    );
  };

  const handleLoanOfficers = async () => {
    const data = rows.filter((row) => row.selected).map((row) => row.Name);

    const res = await fetch(`${apiUrl}/api/admin/updateSelectedLoanOfficers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loanOfficers: data }),
    });

    const result = await res.json();
    console.log(result);
  };

  const handleUpdateWitnessDetails = async (values) => {
    setProcessingWitnessInfo(true);

    try {
      const formData = new FormData();
      formData.append("mandateWitnessName", values.mandateWitnessName);
      formData.append("mandateWitnessAddress", values.mandateWitnessAddress);
      formData.append(
        "mandateWitnessOcupation",
        values.mandateWitnessOcupation
      );
      formData.append(
        "mandateWitnessSignature",
        values.mandateWitnessSignature
      );

      await apiClient.put(`/settings/mandate-witness`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Mandate Witness Details Updated Successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setProcessingWitnessInfo(false);
    }
  };

  return (
    <>
      <div className="TransContainer general__settings">
        {status === "loading" ? (
          <PageLoader />
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <h2 style={{ textAlign: "center", padding: "20px 0" }}>
                Site Settings
              </h2>
              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="siteTitle">Site Title</label>
                  <Field
                    type="text"
                    name="siteTitle"
                    id="siteTitle"
                    className="Input"
                  />
                  <ErrorMessage name="siteTitle" component="div" />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="address">Address</label>
                  <Field
                    type="text"
                    name="address"
                    id="address"
                    className="Input"
                  />
                  <ErrorMessage name="address" component="div" />
                </div>
              </div>

              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="phoneNumber1">Phone Number 1</label>
                  <Field
                    type="text"
                    name="phoneNumber1"
                    id="phoneNumber1"
                    className="Input"
                  />
                  <ErrorMessage name="phoneNumber1" component="div" />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="phoneNumber2">Phone Number 2</label>
                  <Field
                    type="text"
                    name="phoneNumber2"
                    id="phoneNumber2"
                    className="Input"
                  />
                  <ErrorMessage name="phoneNumber2" component="div" />
                </div>
              </div>

              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="email">Email Address</label>
                  <Field
                    type="text"
                    name="email"
                    id="email"
                    className="Input"
                  />
                  <ErrorMessage name="email" component="div" />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="copyrightText">Copyright Text</label>
                  <Field
                    type="text"
                    name="copyrightText"
                    id="copyrightText"
                    className="Input"
                  />
                  <ErrorMessage name="copyrightText" component="div" />
                </div>
              </div>

              {/* top up loan update */}
              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="topUpEligibilityMonths">
                    Top-Up Eligibility (Months)
                  </label>
                  <Field
                    type="number"
                    name="topUpEligibilityMonths"
                    id="topUpEligibilityMonths"
                    className="Input"
                  />
                  <ErrorMessage name="topUpEligibilityMonths" component="div" />
                </div>
              </div>

              <div className="BtnContainer">
                <p>{successMsg}</p>
                {processing && <PageLoader />}
                <BocButton
                  type="submit"
                  width="220px"
                  bgcolor="#ecaa00"
                  bradius="18px"
                >
                  Save Settings
                </BocButton>
              </div>
            </Form>
          </Formik>
        )}
      </div>

      <div className="TransContainer">
        <div>
          <h2 style={{ textAlign: "center", padding: "20px 0" }}>
            Loan Officers
          </h2>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={rows?.every((row) => row.selected)}
                  />
                </th>
                <th>ID</th>
                <th>Code</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {rows?.map((row) => (
                <tr key={row.Code}>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={() => handleCheckboxChange(row.Code)}
                    />
                  </td>
                  <td>{row.Id || ""}</td>
                  <td>{row.Code || ""}</td>
                  <td>{row.Name || ""}</td>
                  <td>{row.Branch || ""}</td>
                  <td>{row.Email || ""}</td>
                  <td>{row.PhoneNumber || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "10px" }}>
            <strong>Selected Loan Officers:</strong>{" "}
            {rows
              ?.filter((row) => row.selected)
              .map((row) => row.Name)
              .join(", ") || "None"}
          </div>
        </div>
        <div className="BtnContainer">
          `
          <BocButton
            onClick={handleLoanOfficers}
            width="220px"
            bgcolor="#ecaa00"
            bradius="18px"
          >
            Save Loan Officers
          </BocButton>
        </div>
      </div>

      <div className="TransContainer">
        {status === "loading" ? (
          <PageLoader />
        ) : (
          <Formik
            initialValues={initialWitnessValues}
            validationSchema={witnessValidationSchema}
            onSubmit={handleUpdateWitnessDetails}
          >
            {({ handleBlur, setFieldValue, errors, touched }) => (
              <Form>
                <h2 style={{ textAlign: "center", padding: "20px 0" }}>
                  Mandate Witness Setting
                </h2>
                <div className="FieldRow">
                  <div className="FieldGroup">
                    <label htmlFor="mandateWitnessName">Witness Name</label>
                    <Field
                      type="text"
                      name="mandateWitnessName"
                      id="mandateWitnessName"
                      className="Input"
                    />
                    <ErrorMessage name="mandateWitnessName" component="div" />
                  </div>
                  <div className="FieldGroup">
                    <label htmlFor="mandateWitnessAddress">
                      Witness Address
                    </label>
                    <Field
                      type="text"
                      name="mandateWitnessAddress"
                      id="mandateWitnessAddress"
                      className="Input"
                    />
                    <ErrorMessage
                      name="mandateWitnessAddress"
                      component="div"
                    />
                  </div>
                </div>

                <div className="FieldRow">
                  <div className="FieldGroup">
                    <label htmlFor="mandateWitnessOcupation">
                      Witness Ocupation
                    </label>
                    <Field
                      type="text"
                      name="mandateWitnessOcupation"
                      id="mandateWitnessOcupation"
                      className="Input"
                    />
                    <ErrorMessage
                      name="mandateWitnessOcupation"
                      component="div"
                    />
                  </div>
                  <div className="FieldGroup IUpload">
                    <label htmlFor="mandateWitnessSignature">Signature</label>
                    <input
                      type="file"
                      name="mandateWitnessSignature"
                      accept="image/png, .png .jpg, .jpeg,"
                      onBlur={handleBlur}
                      id="mandateWitnessSignature"
                      className="Input"
                      onChange={(event) => {
                        setFieldValue(
                          "mandateWitnessSignature",
                          event.currentTarget.files[0]
                        );
                      }}
                      style={{ paddingBottom: "38px", fontSize: "12px" }}
                    />
                    {errors.mandateWitnessSignature &&
                    touched.mandateWitnessSignature ? (
                      <div className="Error">
                        {errors.mandateWitnessSignature}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="BtnContainer">
                  <p>{successMsg}</p>
                  {processing && <PageLoader />}
                  <BocButton
                    type="submit"
                    width="220px"
                    bgcolor="#ecaa00"
                    bradius="18px"
                    disable={processingWitnessInfo}
                  >
                    Save{" "}
                    {processingWitnessInfo && (
                      <PageLoader strokeColor="#0000ff" width="12px" />
                    )}
                  </BocButton>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
};

export default GeneralSettings;

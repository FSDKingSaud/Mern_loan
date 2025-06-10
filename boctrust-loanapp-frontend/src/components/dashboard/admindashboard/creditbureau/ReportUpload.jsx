import React, { useEffect, useState } from "react";
import CreditBureauSelect from "./atoms/CreditBureauSelect";
import ReportTypeSelect from "./atoms/ReportTypeSelect";
import ReportReasonSelect from "./atoms/ReportReasonSelect";

const creditBureauOptions = [
  { value: "first_central", label: "First Central" },
  { value: "crc_bureau", label: "CRC" },
  { value: "credit_register", label: "Credit Registry" },
  // Add more options as needed
];

const ReportUpload = ({
  handleBureauReportUploadChange,
  handleFileUploadChange,
  bureauName,
  reportType,
  reportReason,
}) => {
  const [reportOptions, setReportOptions] = useState([
    { value: "", label: "Choose..." },
  ]);

  useEffect(() => {
    if (bureauName === "first_central") {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
        { value: "commercial_report", label: "Commercial Report" },
      ]);
    } else if (bureauName === "crc_bureau") {
      setReportOptions([
        { value: "consumer_basic", label: "Consumer Basic Report" },
        { value: "consumer_classic", label: "Consumer Classic Report" },
        { value: "corporate_classic", label: "Corporate Classic Report" },
      ]);
    } else if (bureauName === "credit_register") {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
      ]);
    }
  }, [bureauName]);

  return (
    <div className=" d-flex flex-column gap-2">
      <div className="bureau__fileUploadRow">
        <CreditBureauSelect
          bureauName={bureauName}
          creditBureauOptions={creditBureauOptions}
          handleBureauDataChange={handleBureauReportUploadChange}
        />

        <ReportTypeSelect
          bureauName={reportType}
          reportOptions={reportOptions}
          handleBureauDataChange={handleBureauReportUploadChange}
        />
        <ReportReasonSelect
          handleBureauDataChange={handleBureauReportUploadChange}
          bureauName={reportReason}
        />
      </div>
      <div className="row">
        <label
          className="col-form-label fileUpload__label"
          htmlFor="inputGroupFile01"
        >
          Upload Specific Report with the selected properties
        </label>
        <div className="input-group">
          <input
            type="file"
            className="form-control uploadBureaFile"
            id="inputGroupFile01"
            onChange={(e) => handleFileUploadChange(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportUpload;

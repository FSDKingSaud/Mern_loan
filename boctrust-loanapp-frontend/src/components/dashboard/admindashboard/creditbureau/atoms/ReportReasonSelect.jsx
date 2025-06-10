import PropTypes from "prop-types";

const ReportReasonSelect = ({ reportReason, handleBureauDataChange }) => {
  return (
    <div className="row ">
      <label htmlFor="reportReason" className="col-form-label">
        Reason of Report
      </label>
      <div>
        <select
          id="reportReason"
          className="form-select"
          name="reportReason"
          value={reportReason}
          onChange={handleBureauDataChange}
        >
          <option selected>Choose...</option>
          <option value="credit">Credit Report</option>
          <option value="kyc">KYC</option>
        </select>
      </div>
    </div>
  );
};

ReportReasonSelect.propTypes = {
  reportReason: PropTypes.string,
  reportOptions: PropTypes.array,
  handleBureauDataChange: PropTypes.func,
};

export default ReportReasonSelect;

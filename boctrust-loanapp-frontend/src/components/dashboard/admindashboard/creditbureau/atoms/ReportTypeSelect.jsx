import PropTypes from "prop-types";

const ReportTypeSelect = ({
  reportType,
  reportOptions,
  handleBureauDataChange,
}) => {
  return (
    <div className="row">
      <label htmlFor="reportType" className="col-form-label">
        Select Report Type
      </label>
      <div>
        <select
          id="reportType"
          className="form-select"
          name="reportType"
          value={reportType}
          onChange={handleBureauDataChange}
        >
          <option selected>Choose...</option>
          {reportOptions.map((reportOption) => (
            <option key={reportOption.value} value={reportOption.value}>
              {reportOption.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

ReportTypeSelect.propTypes = {
  reportType: PropTypes.string,
  reportOptions: PropTypes.array,
  handleBureauDataChange: PropTypes.func,
};

export default ReportTypeSelect;

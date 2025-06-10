import PropTypes from "prop-types";

const CreditBureauSelect = ({
  bureauName,
  creditBureauOptions,
  handleBureauDataChange,
}) => {
  return (
    <div className="row">
      <label htmlFor="searchType" className="col-form-label">
        Select Credit Bureau
      </label>
      <div>
        <select
          id="searchType"
          className="form-select"
          name="bureauName"
          value={bureauName}
          onChange={handleBureauDataChange}
        >
          <option selected>Choose...</option>
          {creditBureauOptions.map((creditBureauOption) => (
            <option
              key={creditBureauOption.value}
              value={creditBureauOption.value}
            >
              {creditBureauOption.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

CreditBureauSelect.propTypes = {
    bureauName: PropTypes.string,
  creditBureauOptions: PropTypes.array,
  handleBureauDataChange: PropTypes.func,
};

export default CreditBureauSelect;

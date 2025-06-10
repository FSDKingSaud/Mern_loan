import PropTypes from "prop-types";
import "./LabeledInput.css";

const LabeledSelect = ({ data, value, name, disabled, label, onSelect }) => {
  return (
    <div className="input__wrapper">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        disabled={disabled}
        name={name}
        style={{
          width: "100%",
        }}
        value={value}
        label="Interest Payment Frequency"
        onChange={(e) => {
          onSelect(e);
        }}
      >
        <option value="">Select {label}</option>

        {data.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

LabeledSelect.propTypes = {
  data: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default LabeledSelect;

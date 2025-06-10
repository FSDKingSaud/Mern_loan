import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { filterBank } from "./fetchBanks";

const ConfirmField = ({
  labelName,
  readOnly,
  placeholderText,
  fieldName,
  type,
  values,
  func,
}) => {
  const value = values[fieldName];
  const [fieldValue, setFieldValue] = useState(value);
  const employers = useSelector(
    (state) => state.employersManagerReducer.employers.employers
  );

  useEffect(() => {
    if (fieldName === "employerId") {
      const employerInfo = employers.find((employer) => employer._id === value);
      setFieldValue(employerInfo ? employerInfo.employersName : value);
    } else if (fieldName === "bankcode") {
      filterBank(value).then((data) => setFieldValue(data));
    } else {
      setFieldValue(value);
    }
  }, [employers, fieldName, value]);

  return (
    <div>
      <label htmlFor={fieldName}>{labelName}</label>
      <input
        readOnly={readOnly}
        type={type}
        name={fieldName}
        value={fieldValue}
        placeholder={placeholderText}
        onChange={(e) => {
          setFieldValue(e.target.value);
          func(fieldName, e);
        }}
        className="TextInput"
      />
    </div>
  );
};

ConfirmField.propTypes = {
  fieldName: PropTypes.string,
  func: PropTypes.func,
  labelName: PropTypes.string,
  readOnly: PropTypes.bool,
  placeholderText: PropTypes.string,
  type: PropTypes.any,
  values: PropTypes.shape({
    fieldName: PropTypes.any,
  }),
};

export default ConfirmField;

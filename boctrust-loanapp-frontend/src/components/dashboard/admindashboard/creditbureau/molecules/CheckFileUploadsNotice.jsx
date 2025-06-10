import PropTypes from "prop-types";
import { GrStatusGood } from "react-icons/gr";
import "../Credit.css";

const CheckFileUploadsNotice = ({ selectedCreditAnalysis }) => {

  return (
    <div className="d-flex flex-column gap-2 mb-4 mt-2">
      {selectedCreditAnalysis?.creditDbSearch?.dbSearchReport && (
        <div className="upload__noticeItem">
          <GrStatusGood size={22} color="rgb(16 185 129)" /> Credit DB Search
          Report Uploaded
        </div>
      )}
      {selectedCreditAnalysis?.deductCheck?.deductSearchReport && (
        <div className="upload__noticeItem">
          <GrStatusGood size={22} color="rgb(16 185 129)" /> Deduct Search
          Report Uploaded
        </div>
      )}
      {selectedCreditAnalysis?.creditBureauSearch?.map(
        (item) =>
          item
            ?.bureauSearchReport && (
            <div className="upload__noticeItem">
              <GrStatusGood size={22} color="rgb(16 185 129)" />{" "}
              {item.bureauName
                .split("_")
                .join(" ")}{" "}
              Report Uploaded
            </div>
          )
      )}
    </div>
  );
};

CheckFileUploadsNotice.propTypes = {
  selectedCreditAnalysis: PropTypes.object,
};

export default CheckFileUploadsNotice;

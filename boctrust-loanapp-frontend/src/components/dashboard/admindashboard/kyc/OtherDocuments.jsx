import PropTypes from "prop-types";

import BocButton from "../../shared/BocButton";
import styles from "./OtherDocuments.module.css";

import { FaRegFile } from "react-icons/fa6";
import { BsDownload } from "react-icons/bs";
import { HiOutlineEye } from "react-icons/hi2";

const OtherDocuments = ({ customerObj, setShowDocs }) => {
  return (
    <div>
      {/* table section */}
      <div className="Section RBox DCard">
        <div className="">
          <p>
            Below are the files uploaded by{" "}
            <strong>
              {customerObj.firstname} {customerObj.lastname}
            </strong>
          </p>

          <div className={styles.file__itemsList}>
            <FileItem
              file={customerObj.employmentletter}
              fileName={"Employment Letter"}
            />
            <FileItem
              file={customerObj.uploadbankstatement}
              fileName={"Bank Statement"}
            />
            <FileItem
              file={customerObj.marketerClientPic}
              fileName={"DSA/Marketer Image"}
            />
            {customerObj.careertype?.toLowerCase() === "private employee" ? (
              <FileItem file={customerObj.uploadpayslip} fileName={"Payslip"} />
            ) : null}
          </div>
        </div>

        <div className="checkBtn">
          <BocButton
            margin="1rem 0 3rem 0"
            bgcolor="#ecaa00"
            bradius="25px"
            width="200px"
            func={() => setShowDocs(false)}
          >
            Close Docs View
          </BocButton>
        </div>
      </div>
    </div>
  );
};

OtherDocuments.propTypes = {
  customerObj: PropTypes.object,
  setShowDocs: PropTypes.func,
};

export default OtherDocuments;

const FileItem = ({ fileName, file }) => {
  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = file;
    link.download = fileName;
    link.click();
  };
  return (
    <div className={styles.file__itemWrap}>
      <div>
        <FaRegFile size={35} />

        <h5>
          {fileName}
          {(!file || file?.includes("undefined")) && (
            <span className={styles.not__avialable}>Not Avialable</span>
          )}
        </h5>
      </div>
      <div>
        <button
          disabled={!file || file?.includes("undefined")}
          onClick={downloadFile}
          className="btn btn-dark"
        >
          <BsDownload />
          Download
        </button>
        <button
          disabled={!file || file?.includes("undefined")}
          className="btn btn-outline-dark"
        >
          <a href={file} target="_blank">
            <HiOutlineEye />
            View
          </a>
        </button>
      </div>
    </div>
  );
};

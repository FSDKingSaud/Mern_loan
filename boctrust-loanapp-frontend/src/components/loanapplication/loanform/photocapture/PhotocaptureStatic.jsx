import PropTypes from "prop-types";
import { AiOutlineCamera } from "react-icons/ai";
import "./Photocapture.css";

const PhotocaptureStatic = ({ func }) => {
  return (
    <>
      <div className="Container">
        <AiOutlineCamera className="CameraIcon" />
        <button onClick={func} className="BtnReady">
          Take a Photo Capture
        </button>
      </div>
    </>
  );
};

PhotocaptureStatic.propTypes = {
  func: PropTypes.func,
};

export default PhotocaptureStatic;

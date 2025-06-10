import PropTypes from "prop-types";
import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import "./Photocapture.css";

const PhotoCapture = ({ func }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  // Create capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
   
    setImgSrc(imageSrc);
    func(imageSrc);
  }, [webcamRef]);

  // Handle take photos container
  const takePhotos = useCallback(() => {
    const container = document.querySelector(".Container");
    container.style.display = "none";
    const captureContainer = document.querySelector(".CaptureContainer");
    captureContainer.style.display = "block";
  }, []);

  // Handle retake function
  const retake = useCallback(() => {
    setImgSrc(null);
  }, []);

  return (
    <div >
      <div className="Container" onClick={takePhotos} style={{backgroundColor:"Blue"}}>
        <AiOutlineCamera className="CameraIcon" />
        <p className="Text">Take a Photo Now</p>
      </div>

      <div className="CaptureContainer">
        {imgSrc ? (
          <img src={imgSrc} alt="webcam" />
        ) : (
          <Webcam
            height={280}
            width={280}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.8}
          />
        )}
        <div>
          {imgSrc ? (
            <div className="BtnCon">
              <button className="CapBtn RetakeBtn" onClick={retake}>
                Retake
              </button>
            </div>
          ) : (
            <div className="BtnCont">
              <button type="button" className="CapBtn" onClick={capture}>
                Capture
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PhotoCapture.propTypes = {
  func: PropTypes.func,
};

export default PhotoCapture;

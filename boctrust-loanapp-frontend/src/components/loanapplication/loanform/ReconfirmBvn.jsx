import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PageLoader from "../../dashboard/shared/PageLoader";

const ReconfirmBvn = ({ show, setShow }) => {
  const styles = {
    title: {
      color: "#145088",
      fontWeight: "bold",
      fontSize: "20px",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginBottom: "10px",
    },
    button: {
      width: "100%",
      fontSize: "18px",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginBottom: "10px",
      background: "#ecaa00",
      color: "#fff",
    },
    error: {
      color: "red",
      fontSize: "12px",
    },
  };

  const [bvn, setBvn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bvn === "") {
      setErrorMessage("");
    } else if (bvn.length !== 11) {
      setErrorMessage("BVN must be 11 digits");
    } else {
      setErrorMessage("");
    }
  }, [bvn]);

  const handleValidate = async () => {
    // validate bvn
    // if valid, proceed
    // else, show error message
    const apiUrl = import.meta.env.VITE_BASE_URL;
    setLoading(true);
    // fetch data from server using bvn
    const response = await fetch(`${apiUrl}/api/tempdata/tempdata/${bvn}`);

    if (!response.ok) {
      setErrorMessage("Invalid BVN");
      setLoading(false);
      return;
    }

    // const data = await response.json();
    // setFirstStepData(data.data);
    setLoading(false);
    setShow(false);
  };

  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title style={styles.title}> Reconfirm Your BVN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter your BVN to validate your identity</p>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your BVN"
            value={bvn}
            onChange={(e) => setBvn(e.target.value)}
          />
          <p style={styles.error}>{errorMessage}</p>
          {loading && <PageLoader width="28px" />}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={styles.button}
            variant="primary"
            onClick={handleValidate}
          >
            Validate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ReconfirmBvn.propTypes = {
  setFirstStepData: PropTypes.func,
  setShow: PropTypes.func,
  show: PropTypes.bool,
};

export default ReconfirmBvn;

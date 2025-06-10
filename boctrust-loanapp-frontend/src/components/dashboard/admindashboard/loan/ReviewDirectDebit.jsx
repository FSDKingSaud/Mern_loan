import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import PageLoader from "../../shared/PageLoader";

const DirectDebitModal = ({ show, handleClose, customer }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mandateFile, setMandateFile] = useState(null); // State to hold the file
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    productId: 1,
    accountNumber: "0937258920",
    bankCode: "76768",
    payerName: "test",
    payerEmail: "payermail@gmail.com",
    payerAddress: "Lagos",
    accountName: "TestAccount",
    amount: "1000.00",
    narration: "payment",
    phoneNumber: "56120003622",
    subscriberCode: "RJ5W4G4VNTWG",
    startDate: "2023-11-15T08:19:44.855Z",
    endDate: "2024-11-15T08:19:44.855Z",
    billerId: "1",
  });

  // handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  // Handle file selection and conversion to Base64
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMandateFile(reader.result.split(",")[1]); // Set Base64 content
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };
  // console.log(mandateFile)

  // Handle direct debit request processing
  // const handleCreateDebit = async () => {
  //   setLoading(true);

  //   // Validate required fields
  //   if (!startDate || !endDate) {
  //     setLoading(false);
  //     return alert(
  //       "Please fill in all fields, including uploading a mandate file."
  //     );
  //   }

  //   try {
  //     // Create FormData object
  //     const data = {
  //       mandateFile
  //     }

  //     // Make API request
  //     const response = await fetch(`${apiUrl}/api/direct-debit/create-mandate`, {
  //       method: "POST",
  //       headers: {
  //         content
  //       },
  //       body: data, // Send the FormData
  //     });

  //     if (!response.ok) {
  //       // If response is not OK, try to parse JSON for error details
  //       const errorText = await response.text();
  //       console.error("Server returned an error:", errorText);
  //       throw new Error(`Failed with status ${response.status}`);
  //     }

  //     // Parse JSON response
  //     const responseData = await response.json();
  //     console.log("Direct debit request processed successfully:", responseData);

  //     // Reset loading state and close modal
  //     setLoading(false);
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error processing direct debit request:", error.message);
  //     setLoading(false);
  //   }
  // };

  const handleCreateDebit = async () => {
    setLoading(true);

    // Check if required fields are filled
    if (!startDate || !endDate || !mandateFile) {
      setLoading(false);
      return alert(
        "Please fill in all fields, including uploading a mandate file."
      );
    }

    try {
      const bodyData = {
        customerId: customer._id,
        startDate,
        endDate,
        // mandateFile, // Include Base64-encoded file
      };

      const response = await fetch(
        `${apiUrl}/api/direct-debit/create-mandate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Direct debit request processed successfully", data);
        setLoading(false);
        handleClose();
      } else {
        const errorData = await response.json();
        console.error("Failed to process direct debit request:", errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing direct debit request:", error.message);
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Direct Debit Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Existing Fields */}
          <Form.Group>
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={`${customer.customer.firstname} ${customer.customer.lastname}`}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              value={customer.customer.salaryaccountnumber}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Loan Amount</Form.Label>
            <Form.Control
              type="text"
              value={`N${customer.loantotalrepayment}`}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Monthly Repayment Amount</Form.Label>
            <Form.Control
              type="text"
              value={`N${customer.monthlyrepayment}`}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Repayment Mode </Form.Label>
            <Form.Control type="text" value="Monthly" readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Repayment Number of Months </Form.Label>
            <Form.Control type="text" value={customer.numberofmonth} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Direct Debit Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Direct Debit End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>

          {/* File Upload Field */}
          <Form.Group>
            <Form.Label>Mandate File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>

        {loading && <PageLoader width="80px" />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreateDebit}>
          Create Mandate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DirectDebitModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  customer: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    salaryaccountnumber: PropTypes.string,
    loantotalrepayment: PropTypes.number,
  }).isRequired,
};

export default DirectDebitModal;

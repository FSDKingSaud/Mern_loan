import { Modal, Button } from "react-bootstrap";
import Headline from "../../../shared/Headline";
import PropTypes from "prop-types";
import LabeledInput from "../../../shared/labeledInput/LabeledInput";
import { useEffect, useState } from "react";
import LabeledSelect from "../../../shared/labeledInput/LabeledSelect";
import "./BookModal.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import PageLoader from "../../shared/PageLoader";
import { fetchUnbookedLoans } from "../../../../redux/reducers/loanReducer";
import apiClient from "../../../../lib/axios";
import { MdEdit } from "react-icons/md";

const computationModeList = [
  {
    value: "0",
    label: "Variable loan (Fixed/Flat or Reducing loan repayment)",
  },
  {
    value: "1",
    label: "EMI Loan",
  },
];

const frequencyList = [
  {
    value: "0",
    label: "Daily",
  },
  {
    value: "1",
    label: "Weekly",
  },
  {
    value: "2",
    label: "Monthly",
  },
  {
    value: "3",
    label: "quarterly",
  },
  {
    value: "4",
    label: "Annually",
  },
  {
    value: "5",
    label: "Bi-Monthly",
  },
];

const BookingModal = ({ selectedLoan, show, handleClose }) => {
  const [bookingDetails, setBookingDetails] = useState({
    collateralDetails: "",
    collateralType: "",
    computationMode: "",
    moratorium: "",
    interestAccrualCommencementDate: "",
    principalPaymentFrequency: "",
    interestPaymentFrequency: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isReadonly, setIsReadonly] = useState(
    selectedLoan.bookingInitiated ? true : false
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setBookingDetails({
      collateralDetails: selectedLoan?.collateralDetails || "",
      collateralType: selectedLoan?.collateralType || "",
      computationMode: selectedLoan?.computationMode || "",
      moratorium: selectedLoan?.moratorium || "",
      interestAccrualCommencementDate:
        selectedLoan?.interestAccrualCommencementDate || "",
      principalPaymentFrequency: selectedLoan?.principalPaymentFrequency || "",
      interestPaymentFrequency: selectedLoan?.interestPaymentFrequency || "",
    });
  }, [selectedLoan]);

  const handleOnchange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleIniateBooking = async () => {
    try {
      setIsLoading(true);
      await apiClient.put(`/loans/book/${selectedLoan._id}`, bookingDetails);

      await dispatch(fetchUnbookedLoans());
      toast.success("Booking Initiated and Pending Approval");
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveBooking = async () => {
    try {
      setIsLoading(true);

      if (isReadonly) {
        await apiClient.put(`/loans/book/${selectedLoan._id}`, bookingDetails);
      }

      if (!selectedLoan.customer.banking.isAccountCreated) {
        await apiClient.post(
          `/bankone/newCustomerAccount/${selectedLoan?.customer?._id}`
        );
      }

      await apiClient.post(`/bankone/createLoan/${selectedLoan?._id}`);

      await dispatch(fetchUnbookedLoans());
      toast.success("Loan Booking Approved");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="booking__modal"
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title>
              <h4>Booking Details for </h4>

              <Headline
                text={
                  selectedLoan.customer?.banking?.accountDetails
                    ?.CustomerName ||
                  `${selectedLoan?.customer?.firstname} ${selectedLoan?.customer?.lastname}`
                }
              />
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          {isReadonly && (
            <div className="d-flex justify-content-end">
              <button
                onClick={() => setIsReadonly(false)}
                type="button"
                className="btn btn-outline-dark"
              >
                <MdEdit /> Update
              </button>
            </div>
          )}
          <LabeledInput
            name={"collateralDetails"}
            label={"Collateral Details"}
            value={bookingDetails.collateralDetails}
            setInputValue={handleOnchange}
            isTextArea
            disabled={isReadonly}
          />
          <hr />
          <LabeledInput
            name={"collateralType"}
            label={"Collateral Type"}
            value={bookingDetails.collateralType}
            setInputValue={handleOnchange}
            disabled={isReadonly}
          />
          <hr />
          <LabeledSelect
            onSelect={handleOnchange}
            name="computationMode"
            label="Computation Mode"
            data={computationModeList}
            value={bookingDetails.computationMode}
            disabled={isReadonly}
          />

          <hr />
          <LabeledInput
            name={"moratorium"}
            label={"Moratorium"}
            value={bookingDetails.moratorium}
            setInputValue={handleOnchange}
            disabled={isReadonly}
          />
          <hr />

          <LabeledInput
            name={"interestAccrualCommencementDate"}
            label="Interest Accrual Commencement Date"
            value={bookingDetails.interestAccrualCommencementDate}
            setInputValue={handleOnchange}
            disabled={isReadonly}
            isDate
          />
          <hr />

          <LabeledSelect
            onSelect={handleOnchange}
            name="principalPaymentFrequency"
            label="Principal Payment Frequency"
            data={frequencyList}
            disabled={isReadonly}
            value={bookingDetails.principalPaymentFrequency}
          />

          <hr />

          <LabeledSelect
            onSelect={handleOnchange}
            name="interestPaymentFrequency"
            label="Interest Payment Frequency"
            disabled={isReadonly}
            data={frequencyList}
            value={bookingDetails.interestPaymentFrequency}
          />

          <hr />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          {selectedLoan.bookingInitiated ? (
            <Button
              disabled={isLoading}
              onClick={handleApproveBooking}
              variant="primary"
              className="d-flex"
            >
              {isLoading && <PageLoader width="20px" />} Approve Booking
            </Button>
          ) : (
            <Button
              disabled={isLoading || selectedLoan?.bookingInitiated}
              onClick={handleIniateBooking}
              variant="primary"
              className="d-flex"
            >
              {isLoading && <PageLoader width="20px" />} Book Loan
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

BookingModal.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  currentPage: PropTypes.string,
  selectedLoan: PropTypes.object,
};

export default BookingModal;

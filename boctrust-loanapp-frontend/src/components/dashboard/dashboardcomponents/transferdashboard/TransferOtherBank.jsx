import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "./Transfer.css";
import BocButton from "../../shared/BocButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { fetchCustomerAccounts } from "../../../../redux/reducers/accountReducer";
import fetchAllBanks from "../../../loanapplication/loanform/fetchBanks";
import SelectField from "../../../loanapplication/loanform/formcomponents/SelectField";
import PageLoader from "../../shared/PageLoader";
import apiClient from "../../../../lib/axios";
import { toast } from "react-toastify";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  debitAccount: Yup.string().required("Debit Account is required"),
  creditBank: Yup.string().required("Credit Bank is required"),
  creditAccount: Yup.string()
    .required("Credit Account is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  note: Yup.string().required("Note is required"),
});

const initialValues = {
  debitAccount: "",
  creditAccount: "",
  amount: "",
  note: "",
};

const TransferOtherBank = () => {
  const user = useSelector((state) => state.adminAuth.user);

  const [banks, setBanks] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [creditAccountName, setCreditAccountName] = useState("");

  const ref = useRef(null);

  const { customerAccounts } = useSelector((state) => state.accountReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      if (!user?.banking?.accountDetails?.CustomerID) return;
      try {
        await dispatch(
          fetchCustomerAccounts(user?.banking?.accountDetails?.CustomerID)
        );

        await fetchAllBanks(setBanks);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  const getRecipientName = async () => {
    try {
      if (ref.current?.values.creditBank && ref.current?.values.creditAccount) {
        const response = await apiClient.post(`/bankone/accountNameEnquiry`, {
          bankCode: ref.current?.values.creditBank,
          accountNumber: ref.current?.values.creditAccount,
        });

        setCreditAccountName(response.data?.Name);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const payload = {
        amount: values.amount,
        debitAccount: values.debitAccount,
        notes: values.note,
        creditAccountName: creditAccountName,
        creditAccount: values.creditAccount,
      };

      await apiClient.post(`/bankone/interbankTransfer/${user._id}`, payload);

      toast.success("Money Transfer Success");

      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply__forLoan">
      <div className="TransContainer SecCon">
        <DashboardHeadline>Transfer Other Bank</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          innerRef={ref}
        >
          <Form className="appForm">
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="debitAccount">Debit Account</label>
                <Field
                  as="select"
                  name="debitAccount"
                  id="debitAccount"
                  className="Select"
                >
                  <option value="" label="Select an account" />
                  {customerAccounts &&
                    customerAccounts
                      .filter((acc) => acc.accountType != "Loan")
                      .map((option) => (
                        <option
                          key={option.NUBAN}
                          value={option.NUBAN}
                          label={option.NUBAN}
                        />
                      ))}
                </Field>
                <ErrorMessage
                  className="error__msg"
                  name="debitAccount"
                  component="div"
                />
              </div>

              <div className="FieldGroup">
                <label htmlFor="creditBank">Credit Account</label>
                <Field as="select" name="creditBank" id="creditBank">
                  {banks ? (
                    <>
                      <option value="">Select Bank</option>
                      {banks?.map((bank) => {
                        return (
                          <option key={bank.ID} value={bank.Code}>
                            {bank.Name}
                          </option>
                        );
                      })}
                    </>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center">
                      <PageLoader width="20px" />
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  className="error__msg"
                  name="creditBank"
                  component="div"
                />
              </div>
            </div>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="creditAccount">Credit Account</label>
                <Field type="text" name="creditAccount" id="creditAccount">
                  {({ field }) => (
                    <input
                      {...field}
                      type="text"
                      name="creditAccount"
                      id="creditAccount"
                      className="Input"
                      onBlur={(event) => {
                        field.onBlur(event);

                        getRecipientName();
                      }}
                    />
                  )}
                </Field>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "green",
                  }}
                >
                  {ref.current?.values?.creditAccount ? creditAccountName : ""}
                </span>
                <ErrorMessage
                  className="error__msg"
                  name="creditAccount"
                  component="div"
                />
              </div>
              <div className="FieldGroup">
                <label htmlFor="amount">Amount</label>
                <Field
                  type="text"
                  name="amount"
                  id="amount"
                  className="Input"
                />
                <ErrorMessage
                  className="error__msg"
                  name="amount"
                  component="div"
                />
              </div>
            </div>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="note">Note</label>
                <Field type="text" name="note" id="note" className="Input" />
                <ErrorMessage
                  className="error__msg"
                  name="note"
                  component="div"
                />
              </div>
            </div>
            <div className="BtnContainer">
              <BocButton
                fontSize="1.6rem"
                type="submit"
                width="220px"
                bgcolor="#ecaa00"
                bradius="18px"
              >
                SEND MONEY
                {isLoading ? (
                  <PageLoader width="20px" strokeColor="#145088" />
                ) : null}
              </BocButton>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default TransferOtherBank;

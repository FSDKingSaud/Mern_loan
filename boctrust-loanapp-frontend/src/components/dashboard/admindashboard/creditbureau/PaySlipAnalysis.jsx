import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import "./Credit.css";
// function
import { toast, ToastContainer } from "react-toastify";

// toast styles
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../../shared/PageLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleCustomer } from "../../../../redux/reducers/customerReducer";
import CheckPaylsipFileUpload from "./molecules/CheckPaySlipInput";
import apiClient from "../../../../lib/axios";
import { fetchSingleCreditAnalysis } from "../../../../redux/reducers/creditAnalysisReducer";

const employerGroup = {
  police: "police",
  others: "others",
};

const lenderInit = {
  name: "",
  deductions: 0,
};
const PaySlipAnalysis = ({
  recordId,
  formState,
  reportConfirmation,
  setReportConfirmation,
  setFormState,
}) => {
  // const [recordId, setCustomerId] = useState("64fecbd663898c27692bea4c");
  const [isLoading, setIsLoading] = useState(false);

  const [employerGroupings, setEmployerGroupings] = useState(null);

  const [selectedEmployerGroup, setSelectedEmployerGroup] = useState(
    employerGroupings?.other
  );

  const { selectedCreditAnalysis } = useSelector(
    (state) => state.creditAnalysis
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchSingleCreditAnalysis(recordId));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiClient.get(`/agency/payslip-grouping`);

        setEmployerGroupings(res.data);
        setSelectedEmployerGroup(
          res.data?.find((item) => item?.name === employerGroup.others)
        );
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (selectedEmployerGroup) {
      setFormState({
        ...formState,
        benchmark: selectedEmployerGroup?.benchmark,
      });
    }
  }, [selectedEmployerGroup]);

  const handleCivilianPolice = () => {
    setReportConfirmation({
      ...reportConfirmation,
      isApplicantCivilianPolice: !reportConfirmation.isApplicantCivilianPolice,
    });
  };
  const handleChange = () => {
    setReportConfirmation({
      ...reportConfirmation,
      monthlyDeductionBelowPercentageBenchmark:
        !reportConfirmation.monthlyDeductionBelowPercentageBenchmark,
    });
  };
  const handleDeduction = () => {
    setReportConfirmation({
      ...reportConfirmation,
      takeHomePayNotLessThan20PercentGross:
        !reportConfirmation.takeHomePayNotLessThan20PercentGross,
    });
  };
  const handleTakehome = () => {
    setReportConfirmation({
      ...reportConfirmation,
      takeHomePayNotLessThanBenchmark:
        !reportConfirmation.takeHomePayNotLessThanBenchmark,
    });
  };
  const handlePayslip = () => {
    setReportConfirmation({
      ...reportConfirmation,
      isPaySlipContainsMoreThenFiveLenders:
        !reportConfirmation.isPaySlipContainsMoreThenFiveLenders,
    });
  };
  const handleNetPay = () => {
    setReportConfirmation({
      ...reportConfirmation,
      netPayNotLessThanBenchmark:
        !reportConfirmation.netPayNotLessThanBenchmark,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };

  const handleActivateBuyOver = async () => {
    setIsLoading(true);
    try {
      await apiClient.put(`/credit-analysis/activate-buyover/${recordId}`);

      toast.success("Buyover Loan Activation Success", {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error(error?.response?.data?.error, {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    employerGroupings && (
      <div className="TransContainer RBox">
        <div className=" d-flex  justify-content-center p-5">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <h4>Pay Slip Analysis</h4>

            <div className="d-flex gap-4 align-items-center">
              <label htmlFor="searchType" className="fs-6 fw-bold mt-0">
                Employer:
              </label>
              <div style={{ width: "150px" }}>
                <select
                  id="searchType"
                  className="form-select capitalize "
                  value={selectedEmployerGroup?.name}
                  onChange={(e) =>
                    setSelectedEmployerGroup(
                      employerGroupings?.find(
                        (item) => item.name === e.target.value
                      )
                    )
                  }
                >
                  {employerGroupings?.map((group) => (
                    <option
                      className="capitalize"
                      key={group.name}
                      value={group.name}
                    >
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <CheckPaylsipFileUpload
          selectedCreditAnalysis={selectedCreditAnalysis}
        />

        {/* step 1 */}
        <div>
          {/* Pay slip check */}
          <form
            className="row"
            encType="multipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <div className="col-sm-12 col-md-6">
              <div className="d-flex payslip_header  justify-content-start align-items-center">
                <h6 className="creditTitle">Pay Slip Data</h6>
                {selectedCreditAnalysis?.loan?.isTopUpLoan && (
                  <span className=" topup_badge badge_success">
                    Top-Up Loan
                  </span>
                )}
              </div>

              <div className="row mb-3">
                <label htmlFor="netPay" className="col-form-label col-4 mt-2">
                  Enter Net Pay
                </label>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control"
                    name="netPay"
                    value={formState.netPay}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              {selectedEmployerGroup?.name === employerGroup.police && (
                <div className="row mb-3">
                  <label
                    htmlFor="dSearchDate"
                    className="col-form-label col-4 mt-2"
                  >
                    Number of Lenders on Slip
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      name="lenders"
                      value={formState.lenders}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              )}
              <div className="row mb-3">
                <label
                  htmlFor="dSearchDate"
                  className="col-form-label col-4 mt-2"
                >
                  Extra Lenders discovered
                </label>
                <div className="col-8">
                  <input
                    type="number"
                    className="form-control"
                    name="numOfExtraLenders"
                    value={formState.numOfExtraLenders}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* extra lender details */}
              <div id="extraLender ">
                <hr />
                <h5>Add Extra Lender Details</h5>
                {formState.extraLenders?.map((item) => (
                  <div key={item?.id} className="border-bottom mb-3">
                    <div className="row mb-3">
                      <label
                        htmlFor="dSearchDate"
                        className="col-form-label col-4 mt-2"
                      >
                        Name of Lender
                      </label>
                      <div className="col-8">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const currentFormState = { ...formState };
                            currentFormState.extraLenders?.forEach((lender) =>
                              lender.id === item.id
                                ? (item.name = e.target.value)
                                : lender
                            );

                            setFormState(currentFormState);
                          }}
                          className="form-control lenderName"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label
                        htmlFor="dSearchDate"
                        className="col-form-label col-4 mt-2"
                      >
                        Monthly Deductions
                      </label>
                      <div className="col-8">
                        <input
                          type="number"
                          value={item.deductions}
                          onChange={(e) => {
                            const currentFormState = { ...formState };
                            currentFormState.extraLenders?.forEach((lender) =>
                              lender.id === item.id
                                ? (item.deductions = Number(e.target.value))
                                : lender
                            );

                            setFormState(currentFormState);
                          }}
                          className="form-control lenderDeduction"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div id="extraDetails"></div>
                <div className="moreBox pb-4">
                  <div className="d-flex gap-1">
                    {formState?.extraLenders?.length > 0 && (
                      <button
                        onClick={() => {
                          const currentFormState = { ...formState };
                          currentFormState.extraLenders.pop();

                          setFormState(currentFormState);
                        }}
                        className="btn btn-secondary"
                        type="button"
                      >
                        Remove Last
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // addMoreLenders();

                        const currentFormState = [...formState.extraLenders];

                        currentFormState?.push({
                          id: Date.now(),
                          ...lenderInit,
                        });

                        setFormState({
                          ...formState,
                          extraLenders: currentFormState,
                        });
                      }}
                      className="btn btn-success"
                      type="button"
                    >
                      And Another
                    </button>
                  </div>
                </div>
              </div>
              {/* extra lender details end */}

              <div className="row mb-3">
                <label
                  htmlFor="dSearchDate"
                  className="col-form-label col-4 mt-2"
                >
                  Monthly Loan Repayment
                </label>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control"
                    name="monthlyLoanRepayment"
                    value={formState.monthlyLoanRepayment}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label
                  htmlFor="dSearchDate"
                  className="col-form-label col-4 mt-2"
                >
                  Date of Birth
                </label>
                <div className="col-8">
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={formState.dateOfBirth}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label
                  htmlFor="dSearchDate"
                  className="col-form-label col-4 mt-2"
                >
                  Date of Appointment
                </label>
                <div className="col-8">
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfAppointment"
                    value={formState.dateOfAppointment}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {selectedEmployerGroup.name === employerGroup.police && (
                <div className="row reportRow ">
                  <div className="col-sm-8 col-md-8">
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Is applicant a civilian police?
                    </label>
                  </div>

                  <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={reportConfirmation.isApplicantCivilianPolice}
                      onChange={handleCivilianPolice}
                    />
                    <label className="form-check-label mx-3 checked">
                      {reportConfirmation.isApplicantCivilianPolice
                        ? "Yes"
                        : "No"}
                    </label>
                  </div>
                </div>
              )}

              <div className="row mb-3">
                <label
                  htmlFor="dSearchDate"
                  className="col-form-label col-4 mt-2"
                >
                  Upload Pay Slip
                </label>
                <div className="col-8">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        uploadPaySlip: e.target.files[0],
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* report confirmation */}
            <div className="col-sm-12 col-md-6 midBorder">
              <h6 className="creditTitle">Report Confirmation</h6>

              {selectedEmployerGroup?.name === employerGroup.police && (
                <div className="row reportRow ">
                  <div className="col-sm-8 col-md-8">
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Applicant Payslip does not contain more than 5 lenders
                    </label>
                  </div>

                  <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={
                        reportConfirmation.isPaySlipContainsMoreThenFiveLenders
                      }
                      onChange={handlePayslip}
                    />
                    <label className="form-check-label mx-3 checked">
                      {reportConfirmation.isPaySlipContainsMoreThenFiveLenders
                        ? "Yes"
                        : "No"}
                    </label>
                  </div>
                </div>
              )}

              <div className="row reportRow  ">
                <div className="col-sm-8 col-md-8">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Customer Deduction for monthly loan not more than 45% of Net
                    pay
                  </label>
                </div>

                <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={
                      reportConfirmation.monthlyDeductionBelowPercentageBenchmark
                    }
                    onChange={handleChange}
                  />
                  <label className="form-check-label mx-3 checked">
                    {reportConfirmation.monthlyDeductionBelowPercentageBenchmark
                      ? "Yes"
                      : "No"}
                  </label>
                </div>
              </div>

              {selectedEmployerGroup?.name === employerGroup.police && (
                <div className="row reportRow  ">
                  <div className="col-sm-8 col-md-8 ">
                    <label
                      className="form-check-label "
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Customer Take home not less than 20% of Gross Pay
                    </label>
                  </div>

                  <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={
                        reportConfirmation.takeHomePayNotLessThan20PercentGross
                      }
                      onChange={handleDeduction}
                    />
                    <label className="form-check-label mx-3 checked">
                      {reportConfirmation.takeHomePayNotLessThan20PercentGross
                        ? "Yes"
                        : "No"}
                    </label>
                  </div>
                </div>
              )}
              <div className="row reportRow ">
                <div className="col-sm-8 col-md-8">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Customer Take home not less than N
                    {reportConfirmation.isApplicantCivilianPolice &&
                    selectedEmployerGroup.name === employerGroup.police
                      ? selectedEmployerGroup.civilianPolice
                      : selectedEmployerGroup?.benchmark}
                  </label>
                </div>

                <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={reportConfirmation.takeHomePayNotLessThanBenchmark}
                    onChange={handleTakehome}
                  />
                  <label className="form-check-label mx-3 checked">
                    {reportConfirmation.takeHomePayNotLessThanBenchmark
                      ? "Yes"
                      : "No"}
                  </label>
                </div>
              </div>

              <div className="row reportRow ">
                <div className="col-sm-8 col-md-8">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Customer Net Pay is N
                    {reportConfirmation.isApplicantCivilianPolice &&
                    selectedEmployerGroup.name === employerGroup.police
                      ? selectedEmployerGroup.civilianPolice
                      : selectedEmployerGroup?.benchmark}{" "}
                    or more
                  </label>
                </div>

                <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={reportConfirmation.netPayNotLessThanBenchmark}
                    onChange={handleNetPay}
                  />
                  <label className="form-check-label mx-3 checked">
                    {reportConfirmation.netPayNotLessThanBenchmark
                      ? "Yes"
                      : "No"}
                  </label>
                </div>
              </div>

              {selectedCreditAnalysis?.buyoverloan?.toLowerCase() == "yes" && (
                <div className="row mx-5 align-items-center">
                  <button
                    onClick={handleActivateBuyOver}
                    type="button"
                    className="btn btn-success mt-3"
                  >
                    {isLoading ? (
                      <PageLoader width="16px" />
                    ) : (
                      "  Activate Buyover / Top up"
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <ToastContainer />
      </div>
    )
  );
};

PaySlipAnalysis.propTypes = {
  uploadPaySlipAnalysis: PropTypes.func,
  formState: PropTypes.object,
  setFormState: PropTypes.func,
  setReportConfirmation: PropTypes.func,
  reportConfirmation: PropTypes.object,
  recordId: PropTypes.string,
};

export default PaySlipAnalysis;

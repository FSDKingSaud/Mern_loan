import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import "./Credit.css";
import PaySlipAnalysis from "./PaySlipAnalysis";
import DecisionSummary from "./DecisionSummary";
import PdfDocument from "../../../shared/PdfDocument";
import PageLoader from "../../shared/PageLoader";

import FirstCentralPdfReport from "./firstCentralPdfReport";
import FirstCentralCommercialPdf from "./FirstCentralCommercialPdf";
import CRCBasicReportPDF from "./CRCBasicReportPDF";
import CRCCooporateReport from "./CRCCooporateReport";
import { toast, ToastContainer } from "react-toastify";

// toast styles
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import ReportTypeSelect from "./atoms/ReportTypeSelect";
import CreditBureauSelect from "./atoms/CreditBureauSelect";
import ReportReasonSelect from "./atoms/ReportReasonSelect";
import CheckFileUploadsNotice from "./molecules/CheckFileUploadsNotice";
import { customerApprovalEnum } from "../../../../lib/userRelated";
import apiClient from "../../../../lib/axios";
import { fetchSingleCreditAnalysis } from "../../../../redux/reducers/creditAnalysisReducer";
import ReportUpload from "./ReportUpload";

const creditBureauOptions = [
  { value: "first_central", label: "First Central" },
  { value: "crc_bureau", label: "CRC" },
  { value: "credit_register", label: "Credit Registry" },
  // Add more options as needed
];

const apiUrl = import.meta.env.VITE_BASE_URL;

const searchTypes = [
  { value: "defaulters", label: "Defaulters" },
  { value: "request", label: "Request" },
  { value: "issuance", label: "Issuance" },
  // Add more options as needed
];

// file report object
const bureauFileReportInit = {
  firstUpload: {
    bureauSearchReport: "",
    bureauName: "",
    reportType: "",
    reportReason: "",
  },
  secondUpload: {
    bureauSearchReport: "",
    bureauName: "",
    reportType: "",
    reportReason: "",
  },
};

const CreditCheckhtmlForm = ({
  setShowCreditCheckForm,
  recordId,
  initFormStep,
}) => {
  const [reportOptions, setReportOptions] = useState([
    { value: "", label: "Choose..." },
  ]);

  const [isCreditDbCheck, setIsCreditDbCheck] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [searchByDeduct, setSearchByDeduct] = useState("");
  const [applicantNameDeduct, setApplicantNameDeduct] = useState("");
  const [searchDateDeduct, setSearchDateDeduct] = useState("");
  const [remarksDeduct, setRemarksDeduct] = useState("");
  const [reportObj, setReportObj] = useState({});
  const [reportTitle, setReportTitle] = useState("");
  const [dbSearchReport, setDbSearchReport] = useState("");

  const [isDeductCheck, setIsDeductCheck] = useState(false);
  const [deductSearchReport, setDeductSearchReport] = useState("");
  const [bureauReportUpload, setBureauReportUpload] =
    useState(bureauFileReportInit);
  const [noReport, setNoReport] = useState(false);
  const [noCRC, setNoCRC] = useState(false);
  const [noCreditRegistry, setNoCreditRegistry] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [didUploadAny, setDidUploadAny] = useState(false);

  // check if bureau report uploaded state
  const [isReportUploaded, setIsReportUploaded] = useState(false);

  // PaySlip form state
  const [formState, setFormState] = useState({
    netPay: "",
    numOfExtraLenders: 0,
    extraLenders: [],
    monthlyLoanRepayment: 0,
    dateOfBirth: "",
    dateOfAppointment: "",
    uploadPaySlip: "",
    benchmark: 0,
  });

  // {
  //   extraLenderName: "",
  //   extraLenderDeduction: 0,
  // },

  const [reportConfirmation, setReportConfirmation] = useState({
    isApplicantCivilianPolice: false,
    isPaySlipContainsMoreThenFiveLenders: false,
    monthlyDeductionBelowPercentageBenchmark: false,
    takeHomePayNotLessThanBenchmark: false,
    takeHomePayNotLessThan20PercentGross: false,
    netPayNotLessThanBenchmark: false,
  });

  const dispatch = useDispatch();

  const { selectedCreditAnalysis } = useSelector(
    (state) => state.creditAnalysis
  );

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
    if (selectedCreditAnalysis) {
      setReportConfirmation({
        isApplicantCivilianPolice:
          selectedCreditAnalysis?.paySlipAnalysis?.isApplicantCivilianPolice ||
          false,
        isPaySlipContainsMoreThenFiveLenders:
          selectedCreditAnalysis?.paySlipAnalysis
            ?.isPaySlipContainsMoreThenFiveLenders || false,
        monthlyDeductionBelowPercentageBenchmark:
          selectedCreditAnalysis?.paySlipAnalysis
            ?.monthlyDeductionBelowPercentageBenchmark || false,
        netPayNotLessThanBenchmark:
          selectedCreditAnalysis?.paySlipAnalysis?.netPayNotLessThanBenchmark ||
          false,
        takeHomePayNotLessThan20PercentGross:
          selectedCreditAnalysis?.paySlipAnalysis
            ?.takeHomePayNotLessThan20PercentGross || false,
        takeHomePayNotLessThanBenchmark:
          selectedCreditAnalysis?.paySlipAnalysis
            ?.takeHomePayNotLessThanBenchmark || false,
      });

      setFormState({
        netPay: selectedCreditAnalysis?.paySlipAnalysis?.netPay || "",
        numOfExtraLenders:
          selectedCreditAnalysis?.paySlipAnalysis?.numOfExtraLenders || 0,
        extraLenders:
          selectedCreditAnalysis?.paySlipAnalysis?.extraLenders || [],
        monthlyLoanRepayment:
          selectedCreditAnalysis?.paySlipAnalysis?.monthlyLoanRepayment || 0,
        dateOfBirth: selectedCreditAnalysis?.paySlipAnalysis?.dateOfBirth || "",
        dateOfAppointment:
          selectedCreditAnalysis?.paySlipAnalysis?.dateOfAppointment || "",
        uploadPaySlip:
          selectedCreditAnalysis?.paySlipAnalysis?.uploadPaySlip || "",
        benchmark: selectedCreditAnalysis?.paySlipAnalysis?.benchmark || 0,
      });

      setDbSearchReport(
        selectedCreditAnalysis?.creditDbSearch?.dbSearchReport || ""
      );
      setDeductSearchReport(
        selectedCreditAnalysis?.deductCheck?.deductSearchReport || ""
      );

      if (selectedCreditAnalysis?.creditBureauSearch?.length > 0) {
        const bureauSearch = selectedCreditAnalysis?.creditBureauSearch.filter(
          (item) => item.bureauSearchReport != ""
        );

        setBureauReportUpload({
          firstUpload: {
            bureauSearchReport: bureauSearch[0]?.bureauSearchReport || "",
            bureauName: bureauSearch[0]?.bureauName || "",
            reportType: bureauSearch[0]?.reportType || "",
            reportReason: bureauSearch[0]?.reportReason || "",
          },
          secondUpload: {
            bureauSearchReport: bureauSearch[1]?.bureauSearchReport || "",
            bureauName: bureauSearch[1]?.bureauName || "",
            reportType: bureauSearch[1]?.reportType || "",
            reportReason: bureauSearch[1]?.reportReason || "",
          },
        });
      }

      setIsReportUploaded(true);
    }
  }, [selectedCreditAnalysis]);

  const handleChange = () => {
    setIsCreditDbCheck(!isCreditDbCheck);
  };
  const handleDbChange = () => {
    setIsDeductCheck(!isDeductCheck);
  };

  //  Toast Notifications callback
  const notify = (msg) => {
    toast.error(msg);
  };

  // handle file update
  const handleFileUpdate = async () => {
    setIsUpdateLoading(true);
    setDidUploadAny(false);

    const formData = new FormData();

    if (isCreditDbCheck) {
      formData.append("dbSearchReport", dbSearchReport);
      await apiClient.put(
        `/credit-analysis/creditDbSearch/${recordId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Override Content-Type for this request
          },
        }
      );

      setDidUploadAny(true);
      setDbSearchReport("");
      setIsCreditDbCheck(false);
    }

    if (isDeductCheck) {
      formData.append("deductSearchReport", deductSearchReport);
      await apiClient.put(
        `/credit-analysis/deductcheck/${recordId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setDidUploadAny(true);
      setDeductSearchReport("");
      setIsDeductCheck(false);
    }

    if (
      bureauReportUpload.firstUpload.bureauSearchReport &&
      typeof bureauReportUpload.firstUpload.bureauSearchReport !== "string"
    ) {
      Object.entries(bureauReportUpload.firstUpload).map(([key, value]) => {
        formData.append(key, value);
      });

      await apiClient.put(
        `/credit-analysis/creditBureauSearch/${recordId}/fileupload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setDidUploadAny(true);
    }

    if (
      bureauReportUpload.secondUpload.bureauSearchReport &&
      typeof bureauReportUpload.secondUpload.bureauSearchReport !== "string"
    ) {
      const secondUploadFormData = new FormData();
      Object.entries(bureauReportUpload.secondUpload).map(([key, value]) => {
        secondUploadFormData.append(key, value);
      });

      await apiClient.put(
        `/credit-analysis/creditBureauSearch/${recordId}/fileupload`,
        secondUploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setDidUploadAny(true);
    }

    if (
      !bureauReportUpload.firstUpload.bureauSearchReport ||
      !bureauReportUpload.secondUpload.bureauSearchReport
    ) {
      setDidUploadAny(false);
      notify("Please Provide at Least two Bureau search report");
    }

    setBureauReportUpload(bureauFileReportInit);
  };

  // clear report
  const clearReport = () => {
    setReportObj({});
    setFirstCentralReport({});
    setFirstCentralCommercialReport({});
    setPDFContent("");
    setBureauReport("");

    setCrcCooporateReport("");
  };

  // clear form fields
  const clearForm = () => {
    setSearchType("");
    setSearchBy("");
    setApplicantName("");
    setSearchDate("");
    setRemarks("");
    setReportTitle("");
    setDbSearchReport("");
  };

  // handle Credit DB check
  const handleDbCheck = async (e) => {
    try {
      e.preventDefault();

      const searchReport = {
        searchType,
        searchBy,
        searchDate,
        remarks,
        dbSearchReport,
        isCreditDbCheck,
      };
      // setDbSearchReport(dbSearchReport);
      // generate pdf and download
      setReportTitle(() => "Credit DB Check Report");
      const pdfReport = {
        reportTitle,
        applicantName,
        searchType: searchType,
        searchBy: searchBy,
        searchDate: searchDate,
        remarks: remarks,
      };
      setReportObj(pdfReport);

      // send update to backend
      await apiClient.put(
        `/credit-analysis/creditDbSearch/${recordId}`,
        searchReport
      );

      clearForm();
    } catch (error) {
      console.log(error);
    }
  };

  // handle deduct DB check
  const handleDeductCheck = async (e) => {
    try {
      e.preventDefault();

      const searchReport = {
        searchByDeduct,
        searchDateDeduct,
        remarksDeduct,
        deductSearchReport,
        isDeductCheck,
      };

      // setDbSearchReport(dbSearchReport);
      // generate pdf and download
      setReportTitle(() => "Deduct Check Report");
      const pdfReport = {
        reportTitle,
        applicantName: applicantNameDeduct,
        searchType: "Deduct Check",
        searchBy: searchByDeduct,
        searchDate: searchDateDeduct,
        remarks: remarksDeduct,
      };
      setReportObj(pdfReport);

      // send update to backend
      await apiClient.put(
        `/credit-analysis/deductcheck/${recordId}`,
        searchReport
      );

      // clear form fields
      setSearchByDeduct("");
      setApplicantNameDeduct("");
      setRemarksDeduct("");
      setSearchDateDeduct("");
      setReportTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  // credit bureau check logic
  const [bureauData, setBureauData] = useState({
    bureauName: "",
    bvnNo: "",
    reportType: "",
    reportReason: "",
    bureauDate: "",
  });

  const handleBureauDataChange = (e) => {
    const { name, value } = e.target;
    setBureauData({ ...bureauData, [name]: value });
  };

  // report upload change
  const handleBureauReportUploadChange = (e, uploadCategory) => {
    const { name, value } = e.target;
    if (uploadCategory === "first") {
      setBureauReportUpload({
        ...bureauReportUpload,
        firstUpload: {
          ...bureauReportUpload.firstUpload,
          [name]: value,
        },
      });
    } else {
      setBureauReportUpload({
        ...bureauReportUpload,
        secondUpload: {
          ...bureauReportUpload.secondUpload,
          [name]: value,
        },
      });
    }
  };

  const [bureauReport, setBureauReport] = useState(""); // crc basic report
  const [crcCooporateReport, setCrcCooporateReport] = useState("");
  const [crcTitle, setCrcTitle] = useState("");
  const [bureauLoading, setBureauLoading] = useState(false);
  const [firstCentralReport, setFirstCentralReport] = useState([]);
  const [firstCentralCommercialReport, setFirstCentralCommercialReport] =
    useState([]);

  const [PDFContent, setPDFContent] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  // fix update report type options
  useEffect(() => {
    if (bureauData.bureauName === "first_central") {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
        { value: "commercial_report", label: "Commercial Report" },
      ]);
    } else if (bureauData.bureauName === "crc_bureau") {
      setReportOptions([
        { value: "consumer_basic", label: "Consumer Basic Report" },
        { value: "consumer_classic", label: "Consumer Classic Report" },
        { value: "corporate_classic", label: "Corporate Classic Report" },
      ]);
    } else if (bureauData.bureauName === "credit_register") {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
      ]);
    }
  }, [bureauData.bureauName]);

  useEffect(() => {
    if (bureauReportUpload.firstUpload.bureauName === "first_central") {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
        { value: "commercial_report", label: "Commercial Report" },
      ]);
    } else if (bureauReportUpload.firstUpload.bureauName === "crc_bureau") {
      setReportOptions([
        { value: "consumer_basic", label: "Consumer Basic Report" },
        { value: "consumer_classic", label: "Consumer Classic Report" },
        { value: "corporate_classic", label: "Corporate Classic Report" },
      ]);
    } else if (
      bureauReportUpload.firstUpload.bureauName === "credit_register"
    ) {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
      ]);
    }
  }, [bureauReportUpload.firstUpload.bureauName]);
  useEffect(() => {
    if (bureauReportUpload.secondUpload.bureauName === "first_central") {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
        { value: "commercial_report", label: "Commercial Report" },
      ]);
    } else if (bureauReportUpload.secondUpload.bureauName === "crc_bureau") {
      setReportOptions([
        { value: "consumer_basic", label: "Consumer Basic Report" },
        { value: "consumer_classic", label: "Consumer Classic Report" },
        { value: "corporate_classic", label: "Corporate Classic Report" },
      ]);
    } else if (
      bureauReportUpload.secondUpload.bureauName === "credit_register"
    ) {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
      ]);
    }
  }, [bureauReportUpload.secondUpload.bureauName]);

  // handle bureau report generate
  const handleBureauCheck = async (e) => {
    e.preventDefault();
    setBureauLoading(true);
    if (bureauData.bureauName === "first_central") {
      clearReport();

      const reportType = bureauData.reportType;
      const apiEndpoint =
        reportType === "consumer_report"
          ? `${apiUrl}/api/firstcentral/firstcentralreport`
          : `${apiUrl}/api/firstcentral/firstcentralCommercialReport`;
      try {
        const bvn = bureauData.bvnNo;
        const { data } = await apiClient.post(apiEndpoint, { bvn });

        setBureauLoading(false);
        // set first central report
        if (reportType === "consumer_report") {
          // clear report
          setFirstCentralCommercialReport([]);
          setFirstCentralReport(data.data);
        } else {
          // clear report
          setFirstCentralReport([]);
          setFirstCentralCommercialReport(data.data);
        }

        // set bureau loading
        // updateBureauLoading("success");
      } catch (error) {
        setBureauLoading(false);
        return toast.error(error?.message || "Something Went Wrong");
      }
    }

    if (bureauData.bureauName === "crc_bureau") {
      clearReport();
      const reportType = bureauData.reportType;
      const apiEndpoint =
        reportType === "consumer_basic"
          ? `${apiUrl}/api/crc/getcrc`
          : reportType === "consumer_classic"
          ? `${apiUrl}/api/crc/getcrcclassic`
          : `${apiUrl}/api/crc/getcrccooporate`;

      try {
        const bvn = bureauData.bvnNo;
        const { data } = await apiClient.post(apiEndpoint, { bvn });

        // set  report
        if (reportType === "consumer_basic") {
          clearReport();
          setBureauReport(
            data.data.ConsumerSearchResultResponse ||
              data.data.ConsumerNoHitResponse
          );
          setCrcTitle("Consumer Basic Report");
        } else if (reportType === "consumer_classic") {
          clearReport();
          // setCrcClassicReport(data.data.ConsumerSearchResultResponse);
          setBureauReport(
            data.data.ConsumerSearchResultResponse ||
              data.data.ConsumerNoHitResponse
          );
          setCrcTitle("Consumer Classic Report");
        } else {
          clearReport();
          setCrcCooporateReport(
            data.data.CommercialSearchResultResponse ||
              data.data.CommercialNoHitResponse
          );
        }

        // set bureau loading
        setBureauLoading(false);
        // updateBureauLoading("success");
      } catch (error) {
        console.log(error, "error");
        setBureauLoading(false);
        setNoCRC(false);
        return toast.error(error.message);
      }
    }

    if (bureauData.bureauName === "credit_register") {
      clearReport();
      try {
        setNoCreditRegistry(false);
        const bvn = bureauData.bvnNo;
        const { data } = await apiClient.post(
          `${apiUrl}/api/creditregistry/getreport`,
          { bvn }
        );

        // set  report
        setPDFContent(data.data.Reports[0].PDFContent);

        // set bureau loading
        setBureauLoading(false);
        // updateBureauLoading("success");
        setSuccessMsg("Report generated successfully");

        // set success message to empty string after 5 seconds
        setTimeout(() => {
          setSuccessMsg("");
        }, 5000);
      } catch (error) {
        setBureauLoading(false);

        if (error.response.status === 404) {
          setNoCreditRegistry(true);
        }
        return toast.error(error.message);
      }
    }

    try {
      await apiClient.put(
        `/credit-analysis/creditBureauSearch/${recordId}`,
        bureauData
      );
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something Went Wrong");
    }
  };

  // submit Paylslip form data to backend
  const uploadPaySlipAnalysis = async () => {
    setIsUpdateLoading(true);

    if (!selectedCreditAnalysis) return;

    const actualNetPay = selectedCreditAnalysis?.buyoverloanactivated
      ? selectedCreditAnalysis?.liquidationbalance + formState.netPay
      : formState.netPay;

    const formData = new FormData(); // create a new FormData object
    formData.append("netPay", actualNetPay); // add the fields to formData

    console.log(formState.uploadPaySlip, "formState.uploadPaySlip");

    formData.append(
      "extraLenders",
      JSON.stringify(
        formState.extraLenders.map((item) => ({
          name: item.name,
          deductions: item.deductions,
        }))
      )
    );
    formData.append("monthlyLoanRepayment", formState.monthlyLoanRepayment);
    formData.append("dateOfBirth", formState.dateOfBirth);
    formData.append("dateOfAppointment", formState.dateOfAppointment);
    formData.append(
      "isApplicantCivilianPolice",
      reportConfirmation.isApplicantCivilianPolice
    );
    formData.append("uploadPaySlip", formState.uploadPaySlip);
    formData.append(
      "isPaySlipContainsMoreThenFiveLenders",
      reportConfirmation.isPaySlipContainsMoreThenFiveLenders
    );
    formData.append("benchmark", formState.benchmark);
    formData.append(
      "monthlyDeductionBelowPercentageBenchmark",
      reportConfirmation.monthlyDeductionBelowPercentageBenchmark
    );
    formData.append(
      "takeHomePayNotLessThanBenchmark",
      reportConfirmation.takeHomePayNotLessThanBenchmark
    );
    formData.append(
      "takeHomePayNotLessThan20PercentGross",
      reportConfirmation.takeHomePayNotLessThan20PercentGross
    );
    formData.append(
      "netPayNotLessThanBenchmark",
      reportConfirmation.netPayNotLessThanBenchmark
    );

    // send formData object to backend
    await apiClient.put(
      `/credit-analysis/paySlipAnalysis/${recordId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // clear form fields
    setFormState({
      netPay: "",
      numOfExtraLenders: 0,
      extraLenders: [],
      monthlyLoanRepayment: 0,
      dateOfBirth: "",
      dateOfAppointment: "",
      uploadPaySlip: "",
      benchmark: 0,
    });
  };

  // handle next prev form step start
  const [formStep, setFormStep] = useState(initFormStep || 1);

  const handleNext = async () => {
    if (formStep === 1) {
      if (
        !bureauReportUpload.firstUpload.bureauSearchReport ||
        !bureauReportUpload.secondUpload.bureauSearchReport
      ) {
        return notify("Please Provide at Least two Bureau search report");
      }
      try {
        setIsUpdateLoading(true);
        await handleFileUpdate();
        didUploadAny && toast.success("File(s) Upload Success");
        setFormStep(2);
      } catch (error) {
        toast.error(error?.response?.data?.error || error?.message);
      } finally {
        setIsUpdateLoading(false);
      }
    } else if (formStep === 2) {
      if (!formState.uploadPaySlip) {
        return notify("Please Provide a Payslip");
      }
      if (!formState.netPay || !formState.monthlyLoanRepayment) {
        return notify("Please Provide a Valid Netpay and Monthly Repayment");
      }

      if (formState.extraLenders?.length < formState.numOfExtraLenders) {
        return toast.error(
          "Number of extra Lenders not Matching Details Suplied"
        );
      }

      try {
        setDidUploadAny(true);
        await uploadPaySlipAnalysis();
        didUploadAny && toast.success("Info Updated Success");
        setFormStep(3);
      } catch (error) {
		console.log(error)
        toast.error(error?.message);
      } finally {
        setDidUploadAny(true);
        setIsUpdateLoading(false);
      }
    } else {
      setFormStep(3);
    }
  };

  const handlePrev = () => {
    if (formStep === 2) {
      setFormStep(1);
    } else if (formStep === 3) {
      setFormStep(2);
    } else {
      setShowCreditCheckForm(false);
    }
  };

  // scroll to the top of the page
  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.scrollTo(0, 0);
  }, [formStep]);

  useEffect(() => {
    if (noCreditRegistry) {
      setTimeout(() => {
        setNoCreditRegistry(false);
      }, 5000);
    }
  }, [noCreditRegistry]);

  return (
    <>
      {formStep === 1 && (
        <div className="TransContainer RBox">
          {isReportUploaded && (
            <CheckFileUploadsNotice
              selectedCreditAnalysis={selectedCreditAnalysis}
            />
          )}
          {/* step 1 */}
          <div className="row">
            {/* credit DB check */}
            <div className="col-sm-12 mb-5 col-md-4">
              <h6 className="creditTitle">Do Credit DB Check</h6>
              <form onSubmit={handleDbCheck}>
                <div className="row mb-3">
                  <label htmlFor="searchType" className="col-form-label">
                    Choose Search Type
                  </label>
                  <div>
                    <select
                      id="searchType"
                      className="form-select"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option selected>Choose...</option>
                      {searchTypes.map((searchType) => (
                        <option key={searchType.value} value={searchType.value}>
                          {searchType.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="searchInput" className="col-form-label">
                    IPPIS, BVN, or Phone No
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="searchInput" className="col-form-label">
                    Applicant Full-name
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="dSearchDate" className="col-form-label">
                    Search Date
                  </label>
                  <div>
                    <input
                      type="date"
                      className="form-control"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row my-3">
                  <label htmlFor="netPay" className="col-form-label">
                    Remarks
                  </label>
                  <div>
                    <textarea
                      className="form-control"
                      id="netPay"
                      placeholder="Enter remarks here..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="row mx-md-5 align-items-center">
                  <button type="submit" className="btn btn-warning mt-3">
                    Generate Manual Report
                  </button>
                </div>
              </form>
            </div>

            {/* deduct check */}
            <div className="col-sm-12 mb-5 col-md-4 midBorder">
              <h6 className="creditTitle">Do Deduct Check</h6>
              <form onSubmit={handleDeductCheck}>
                <div className="row mb-3">
                  <label htmlFor="dSearchInput" className="col-form-label">
                    IPPIS
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={searchByDeduct}
                      onChange={(e) => setSearchByDeduct(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="searchInput" className="col-form-label">
                    Applicant Full-name
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={applicantNameDeduct}
                      onChange={(e) => setApplicantNameDeduct(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="dSearchDate" className="col-form-label">
                    Search Date
                  </label>
                  <div>
                    <input
                      type="date"
                      className="form-control"
                      value={searchDateDeduct}
                      onChange={(e) => setSearchDateDeduct(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row my-3">
                  <label htmlFor="netPay" className="col-form-label">
                    Remarks
                  </label>
                  <div>
                    <textarea
                      className="form-control"
                      id="netPay"
                      placeholder="Enter remarks here..."
                      value={remarksDeduct}
                      onChange={(e) => setRemarksDeduct(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="row mx-md-5 align-items-center">
                  <button type="submit" className="btn btn-warning mt-3">
                    Generate Manual Report
                  </button>
                </div>
              </form>
            </div>

            {/* credit bureau check */}
            <div className="col-sm-12 mb-sm-5 col-md-4">
              <h6 className="creditTitle">Do Credit Bureau Check</h6>
              <form onSubmit={handleBureauCheck}>
                <CreditBureauSelect
                  bureauName={bureauData.bureauName}
                  creditBureauOptions={creditBureauOptions}
                  handleBureauDataChange={handleBureauDataChange}
                />

                <div className="row mb-3">
                  <label htmlFor="dSearchInput" className="col-form-label">
                    BVN | Business Name | RC. NO
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      name="bvnNo"
                      value={bureauData.bvnNo}
                      onChange={handleBureauDataChange}
                    />
                  </div>
                </div>

                <ReportTypeSelect
                  reportType={bureauData.reportType}
                  reportOptions={reportOptions}
                  handleBureauDataChange={handleBureauDataChange}
                />
                <ReportReasonSelect
                  handleBureauDataChange={handleBureauDataChange}
                  reportReason={bureauData.reportReason}
                />

                <div className="row mb-3">
                  <label htmlFor="dSearchInput" className="col-form-label">
                    Search Date
                  </label>
                  <div>
                    <input
                      type="date"
                      className="form-control"
                      name="bureauDate"
                      value={bureauData.bureauDate}
                      onChange={handleBureauDataChange}
                    />
                  </div>
                </div>

                <div className="row mx-md-5 align-items-center">
                  <button type="submit" className="btn btn-warning mt-3">
                    Generate Report
                  </button>
                </div>
              </form>
            </div>

            {/* loading bar */}
            <div>{bureauLoading && <PageLoader />}</div>
            {/* success message */}
            <p style={{ color: "#ecaa00" }}>{successMsg}</p>
          </div>

          <div className="row m-5">
            {/* generated pdf report component */}
            {Object.keys(reportObj).length > 0 && (
              <PdfDocument report={reportObj} />
            )}
          </div>

          {/* first centra render */}
          <div className="row m-5">
            {noReport && <h4>No First Central Report</h4>}
            {/* generated pdf report component */}

            {firstCentralReport?.length > 0 && (
              <FirstCentralPdfReport report={firstCentralReport} />
            )}
            {Object.keys(firstCentralCommercialReport).length > 0 && (
              <FirstCentralCommercialPdf
                report={firstCentralCommercialReport}
              />
            )}
          </div>

          {/* crc render report */}
          <div className="row m-5">
            {noCRC && <h4>No CRC Report</h4>}
            {/* generated pdf report component */}
            {bureauReport && (
              <CRCBasicReportPDF
                report={bureauReport}
                formData={bureauData}
                title={crcTitle}
              />
            )}

            {crcCooporateReport && (
              <CRCCooporateReport
                report={crcCooporateReport}
                formData={bureauData}
              />
            )}
          </div>

          {/* credit registry report */}
          <div className="row" style={{ width: "100%", marginTop: "-198px" }}>
            {PDFContent ? (
              <div style={{ height: "100vh" }}>
                <h3>Credit Registry Report</h3>
                <embed
                  src={`data:application/pdf;base64,${PDFContent}`}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : noCreditRegistry ? (
              <h4
                style={{
                  color: "#000000",
                  padding: "3rem",
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  display: "grid",
                  placeContent: "center",
                }}
              >
                No CRedit Registry Report for Customer
              </h4>
            ) : null}
          </div>

          {/* attach report */}
          <div className="row" style={{ marginTop: "130px" }}>
            <h4>Upload Reports</h4>
            <form encType="multipart/form-data">
              {/* credit report section */}
              <div className="row reportRow">
                <div className="col-sm-8 col-md-4">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Is there a Credit DB Report?
                  </label>
                </div>

                <div className="form-check form-switch col-sm-4 col-md-2 mt-4 d-flex">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={isCreditDbCheck}
                    onChange={handleChange}
                  />
                  <label className="form-check-label mx-3 checked">
                    {isCreditDbCheck ? "Yes" : "No"}
                  </label>
                </div>
                <div className="col-sm-12 col-md-6 mt-2">
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setDbSearchReport(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              {/* deduct report */}
              <div className="row reportRow">
                <div className="col-sm-8 col-md-4">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Is there a Deduct Report?
                  </label>
                </div>

                <div className="form-check form-switch col-sm-4 col-md-2 mt-4 d-flex">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={isDeductCheck}
                    onChange={handleDbChange}
                  />
                  <label className="form-check-label mx-3 checked">
                    {isDeductCheck ? "Yes" : "No"}
                  </label>
                </div>
                <div className="col-sm-12 col-md-6 mt-2">
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setDeductSearchReport(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              {/* credit bureau report upload section */}
              <div className=" reportRow ">
                <div className=" mt-2 ">
                  <div className="">
                    <label
                      className="form-check-label w-100 text-center mb-3"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Upload at Least 2 Credit Bureau reports
                    </label>
                  </div>

                  <ReportUpload
                    bureauName={bureauReportUpload.firstUpload.bureauName}
                    reportType={bureauReportUpload.firstUpload.reportType}
                    reportReason={bureauReportUpload.firstUpload.reportReason}
                    handleFileUploadChange={(e) =>
                      setBureauReportUpload({
                        ...bureauReportUpload,
                        firstUpload: {
                          ...bureauReportUpload.firstUpload,
                          bureauSearchReport: e.target.files[0],
                        },
                      })
                    }
                    handleBureauReportUploadChange={(e) =>
                      handleBureauReportUploadChange(e, "first")
                    }
                  />

                  <hr />

                  <ReportUpload
                    bureauName={bureauReportUpload.secondUpload.bureauName}
                    reportType={bureauReportUpload.secondUpload.reportType}
                    reportReason={bureauReportUpload.secondUpload.reportReason}
                    handleFileUploadChange={(e) =>
                      setBureauReportUpload({
                        ...bureauReportUpload,
                        secondUpload: {
                          ...bureauReportUpload.secondUpload,
                          bureauSearchReport: e.target.files[0],
                        },
                      })
                    }
                    handleBureauReportUploadChange={(e) =>
                      handleBureauReportUploadChange(e, "second")
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* pay slip analysis component */}
      {formStep === 2 && (
        <PaySlipAnalysis
          recordId={recordId}
          formState={formState}
          setFormState={setFormState}
          reportConfirmation={reportConfirmation}
          setReportConfirmation={setReportConfirmation}
        />
      )}
      {/* decision summary */}
      {formStep === 3 && <DecisionSummary recordId={recordId} />}
      {/* next prev button */}
      <div className="row d-flex justify-content-center">
        {selectedCreditAnalysis?.decisionSummary.creditOfficerApprovalStatus ===
          customerApprovalEnum.pending && (
          <button className="btn btn-warning btn-prev" onClick={handlePrev}>
            Prev
          </button>
        )}
        {selectedCreditAnalysis?.decisionSummary.creditOfficerApprovalStatus ===
        customerApprovalEnum.pending ? (
          <button className="btn btn-primary btn-next" onClick={handleNext}>
            {isUpdateLoading ? <PageLoader width="16px" /> : "Next"}
          </button>
        ) : (
          <button
            onClick={async () => {
              setShowCreditCheckForm(false);
              await dispatch(fetchAllCustomer());
            }}
            className="btn btn-success btn-next"
          >
            Analyis Process Completed
          </button>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

CreditCheckhtmlForm.propTypes = {
  customerId: PropTypes.string,
  setShowCreditCheckForm: PropTypes.func,
  initFormStep: PropTypes.number,
};

export default CreditCheckhtmlForm;

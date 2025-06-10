/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
// fetch data from api
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/reducers/productReducer";
import { fetchEmployers } from "../../../redux/reducers/employersManagerReducer";
// formik and yup for form data management
import { Formik, Form, Field, ErrorMessage } from "formik";
import validationSchema from "./formvalidation";
// state and lga
import NaijaStates from "naija-state-local-government";
import Headline from "../../shared/Headline";
import TextInput from "./formcomponents/TextInput";
import SelectField from "./formcomponents/SelectField";
import "./Form.css";
import PhotoCapture from "./photocapture/PhotoCapture";
import PhotocaptureStatic from "./photocapture/PhotocaptureStatic";
import ConfirmData from "./ConfirmData";
import CreateAccount from "./CreateAccount";
import initialValues, { fileValues } from "./formInitialValue";
// function
import convertFile from "../../../../utilities/convertFile";
import dataURItoBlob from "../../../../utilities/dataURItoBlob";
import generateCustomerId from "../../dashboard/admindashboard/customers/generateCustomerId";
import ReconfirmBvn from "./ReconfirmBvn";
import fetchAllBanks from "./fetchBanks";
import { getBvnDetails } from "./bvnVerification";
import { toast } from "react-toastify";
import Select from "react-select";
import { BsInfoSquareFill } from "react-icons/bs";

// toast styles
import "react-toastify/dist/ReactToastify.css";
import { calcDaysDiffFromNow } from "../../../../utilities/calcDaysDiff";
import { fetchAllLoanOfficers } from "../../../redux/reducers/loanOfficerReducer";
import {
  deleteFromLocalStorage,
  getFile,
  getFromLocalStorage,
  storeInLocalStorage,
} from "../../../../utilities/localStorage";

import axios from "axios";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import PageLoader from "../../dashboard/shared/PageLoader";
import { useNavigate } from "react-router-dom";
import { handleGeneratingFile } from "../../../services/generateMandateFile";
import { fetchSetting } from "../../../redux/reducers/settingReducer";

const apiUrl = import.meta.env.VITE_BASE_URL;

// loan form component
const LoanForm = React.memo(function LoanFormComponent() {
  // open photo capture fix code start
  const [openCapture, setOpenCapture] = useState(false);
  const handleOpenCapture = () => {
    setOpenCapture(true);
  };

  // fetch loan product
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employers = useSelector(
    (state) => state.employersManagerReducer.employers.employers
  );
  const { allLoanOfficers } = useSelector((state) => state.loanOfficerReducer);
  const settings = useSelector(
    (state) => state?.settingReducer?.settings?.settings
  );
  //( For Development)
  // const { loanFirstInfo } = useSelector((state) => state.customerReducer);

  // get start data from local storage
  const [careerType, setCareerType] = useState("");
  const [loanRepaymentTotal, setLoanRepaymentTotal] = useState("");
  const [monthlyRepayment, setMonthlyRepayment] = useState("");
  const [product, setProduct] = useState({});
  const [showReconfirmBvn, setShowReconfirmBvn] = useState(false);
  const [firstStepData, setFirstStepData] = useState({});
  // fetch all commercial banks
  const [banks, setBanks] = useState([]);

  const [accountCheckError, setAccountCheckError] = useState("");
  const [accountCheckMessage, setAccountCheckMessage] = useState("");
  const [accountCheckLoading, setAccountCheckLoading] = useState(false);

  // Function to initialize the bvn details extraction after redirect to clallback url
  const initializeApp = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get("code");

    setFirstStepData(JSON.parse(sessionStorage.getItem("loanFirstInfo")));

    // if (code) {
    //   const { bvn } = await getBvnDetails(code); // Call this function if there's an authorization code in the URL
    //   const firstDataResponse = await axios.get(
    //     `${import.meta.env.VITE_BASE_URL}/api/tempdata/tempdata/${bvn}`
    //   );
    //   setFirstStepData(firstDataResponse.data.data);
    //   await axios.delete(
    //     `${import.meta.env.VITE_BASE_URL}/api/tempdata/tempdata/${bvn}`
    //   );
    // } else {
    //   // Optionally, handle other initialization tasks here
    //   console.log("No authorization code found. Proceed with the normal flow.");
    // }
  };

  const checkIfBvnInUse = async (bvn) => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/bankone/checkBvnExist/${bvn}`
      );
      setIsBvnInUse(data.message);
    } catch (error) {
      console.log("Error checking BVN in use: ", error);
    }
  };

  const checkIfAccountValid = async (accountNumber) => {
    if (accountNumber.length !== 10) {
      return;
    }

    try {
      setAccountCheckLoading(true);
      const { data } = await axios.get(
        `${apiUrl}/api/bankone/checkAccountValid/${ref.current.values.bvnnumber}/${accountNumber}`
      );
      setAccountCheckMessage("You can proceed...");
      return data.message;
    } catch (error) {
      setAccountCheckError(
        error?.response?.data?.error || "Unable to Check Bvn"
      );
      console.log("Error checking Account: ", error);
    } finally {
      setAccountCheckLoading(false);
    }
  };

  // Fetch Officers, Products and Employers
  useEffect(() => {
    const getData = async () => {
      try {
        await initializeApp();

        await dispatch(fetchAllLoanOfficers());
        await dispatch(fetchProduct());
        await dispatch(fetchEmployers());
        await dispatch(fetchSetting());
        // fetching Banks
        await fetchAllBanks(setBanks);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    // set showReconfirmBvn modal after 30 seconds
    const timer = setTimeout(() => {
      setShowReconfirmBvn(false);
    }, 30000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []);

  // fetch first form data here
  useEffect(() => {
    if (firstStepData) {
      ref.current?.setFieldValue("bvnnumber", firstStepData?.bvn || "");
      ref.current?.setFieldValue("loanamount", firstStepData?.loanAmount || "");
      ref.current?.setFieldValue("careertype", firstStepData?.careerType || "");
      setCareerType(firstStepData.careerType || "government employee");
      ref.current?.setFieldValue(
        "numberofmonth",
        firstStepData?.numberOfMonths || ""
      );

      setLoanRepaymentTotal(firstStepData.loanTotalRepayment || "");
      setMonthlyRepayment(firstStepData.monthlyRepayment || "");
      ref.current?.setFieldValue(
        "monthlyRepayment",
        firstStepData.monthlyRepayment
      );
      ref.current?.setFieldValue("loanproduct", firstStepData.loanProduct?._id);
      setProduct(firstStepData.loanProduct || {});

      if (firstStepData?.bvn) {
        checkIfBvnInUse(firstStepData?.bvn);
      }
    } else {
      navigate("/loan");
    }
  }, [firstStepData]);

  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(true);
  const [showBankStatement, setShowBankStatement] = useState(false);
  const [showEmploymentLetter, setShowEmploymentLetter] = useState(false);

  const [stepImg, setStepImg] = useState("https://i.imgur.com/DPMDjLy.png");
  const [state, setState] = useState("");
  const [lga, setLga] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [_, setDeductions] = useState("");
  const [isBVNInUse, setIsBvnInUse] = useState(false);

  // file upload
  const [captureImg, setCaptureImg] = useState("");
  const [idCard, setIdCard] = useState("");
  const [paySlip, setPaySlip] = useState("");
  const [bankStatements, setBankStatements] = useState("");
  const [employmentLetter, setEmploymentLetter] = useState("");
  const [signature, setSignature] = useState("");
  const [marketerClientPic, setMarketerClientPic] = useState("");

  const fileFields = [
    "valididcard",
    "uploadbankstatement",
    "signature",
    "marketerClientPic",
    "photocapture",
    "employmentletter",
    "uploadpayslip",
  ];

  const [agentCode, setAgentCode] = useState(null);

  const updateFormValues = () => {
    const formValues = getFromLocalStorage("onbaordData");

    if (formValues) {
      ref.current?.setValues({
        ...formValues,
        ...fileFields.reduce((acc, field) => {
          acc[field] = getFile(
            field,
            `${field}_for_${formValues.firstname}_${formValues.lastname}`
          );
          return acc;
        }, {}),
      });
      setState(formValues["stateofresidence"]);
      setLga(NaijaStates.lgas(formValues["stateofresidence"]));
    }
  };
  const [sigError, setSigError] = useState(false);

  useEffect(() => {
    updateFormValues();
  }, []);

  // scroll to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, showForm]);

  // update photocapture value when captureImg change
  useEffect(() => {
    if (captureImg) {
      ref.current?.setFieldValue("photocapture", captureImg);
      storeInLocalStorage({ key: "onbaordData", value: ref.current?.values });
    }
    if (idCard) {
      ref.current?.setFieldValue("valididcard", idCard);
    }
    if (paySlip) {
      ref.current?.setFieldValue("uploadpayslip", paySlip);
    }
    if (bankStatements) {
      ref.current?.setFieldValue("uploadbankstatement", bankStatements);
    }
    if (employmentLetter) {
      ref.current?.setFieldValue("employmentletter", employmentLetter);
    }
    if (signature) {
      ref.current?.setFieldValue("signature", signature);
    }
    if (marketerClientPic) {
      ref.current?.setFieldValue("marketerClientPic", marketerClientPic);
    }
  }, [captureImg, idCard, paySlip, employmentLetter, marketerClientPic, signature, bankStatements]);

  // get current formik value
  const ref = useRef();

  // find employer using id
  const [employerId, setEmployerId] = useState("");

  const [employer, setEmployer] = useState({});

  const findEmployer = (id) => {
    const employer = employers.find((employer) => employer._id === id);

    if (careerType?.toLowerCase() === "government employee") {
      const statementDurationThreshold =
        employer?.statementRule?.maximumTenure.length > 0
          ? employer?.statementRule?.maximumTenure.split(" ")[0]
          : employer?.statementRule?.maximumTenure;

      if (employer?.statementRule?.logicalRelationship === "AND") {
        Number(ref.current?.values?.loanamount.replace(/,/g, "")) >
          Number(employer?.statementRule?.maximumAmount) &&
        Number(ref.current?.values?.numberofmonth) >
          Number(statementDurationThreshold)
          ? setShowBankStatement(true)
          : setShowBankStatement(false);
      } else if (employer?.statementRule?.logicalRelationship === "OR") {
        Number(ref.current?.values?.loanamount.replace(/,/g, "")) >
          Number(employer?.statementRule?.maximumAmount) ||
        Number(ref.current?.values?.numberofmonth) >
          Number(statementDurationThreshold)
          ? setShowBankStatement(true)
          : setShowBankStatement(false);
      }

      // Employment Letter
      const emplmLetterThresholdDuration =
        employer?.employerLetterRule?.maximumTenure.length > 0
          ? employer?.employerLetterRule?.maximumTenure.split(" ")[0]
          : employer?.employerLetterRule?.maximumTenure;

      if (employer?.employerLetterRule?.logicalRelationship === "AND") {
        Number(ref.current?.values?.loanamount.replace(/,/g, "")) >
          Number(employer?.employerLetterRule?.maximumAmount) &&
        Number(ref.current?.values?.numberofmonth) >
          Number(emplmLetterThresholdDuration)
          ? setShowEmploymentLetter(true)
          : setShowEmploymentLetter(false);
      } else if (employer?.employerLetterRule?.logicalRelationship === "OR") {
        Number(ref.current?.values?.loanamount.replace(/,/g, "")) >
          Number(employer?.employerLetterRule?.maximumAmount) ||
        Number(ref.current?.values?.numberofmonth) >
          Number(emplmLetterThresholdDuration)
          ? setShowEmploymentLetter(true)
          : setShowEmploymentLetter(false);
      }
    }

    return employer;
  };

  useEffect(() => {
    if (employerId) {
      setEmployer(findEmployer(employerId));
    }
  }, [employerId]);

  // Set Deduction initail Value
  useEffect(() => {
    const careertype = careerType;
    setDeductions("Rerender");

    ref.current?.setFieldValue(
      "deductions",
      calcDaysDiffFromNow(ref.current?.values.employmentstartdate) <
        Number(employer?.mandateRule?.mandateDuration.split(" ")[0]) &&
        employer?.mandateRule?.allowStacking == "yes"
        ? "remita"
        : calcDaysDiffFromNow(ref.current?.values.employmentstartdate) >=
            Number(employer?.mandateRule?.mandateDuration.split(" ")[0]) &&
          careertype.toLowerCase() === "government employee"
        ? "ippis"
        : ""
    );
  }, [employer, careerType]);

  // state and lgas
  const ngState = NaijaStates.states();
  const lgas = lga.lgas;
  // handle select state
  const handleSelectState = (e) => {
    const state = e.target.value;

    setState(state);
    setLga(NaijaStates.lgas(state));
    // update state form value
    ref.current?.setFieldValue("stateofresidence", state);
  };

  // handle form submit/move to next step
  const handleSubmit = async () => {
    // handle form submit to backend here
    try {
      if (ref.current.values) {
        let formValues;
        ref.current?.values;

        if (isLastStep !== null) {
          formValues = onboardData;
          formValues.email = ref.current?.values?.email;
          formValues.username = ref.current?.values?.username;
          formValues.password = ref.current?.values?.password;
          formValues.confirmpassword = ref.current?.values?.confirmpassword;
        } else {
          formValues = ref.current?.values;
        }

        const employer = employers.find(
          (employer) => employer._id === formValues.employerId
        );

        // generate customer id
        const customerId = generateCustomerId();
        const formData = new FormData();

        console.log(formValues.photocapture, "formValues.photocapture");

        formData.append("customerId", customerId);
        formData.append(
          "loanamount",
          parseInt(formValues.loanamount.replace(/,/g, ""))
        );
        formData.append("numberofmonth", formValues.numberofmonth);
        formData.append("loantotalrepayment", loanRepaymentTotal);
        formData.append("monthlyrepayment", monthlyRepayment);
        formData.append("careertype", formValues.careertype);
        formData.append("loanproduct", product?._id);
        formData.append("loanpurpose", formValues.loanpurpose);
        formData.append("otherpurpose", formValues.otherpurpose);
        formData.append("bvnnumber", formValues.bvnnumber);
        formData.append("title", formValues.title);
        formData.append("gender", formValues.gender);
        formData.append("firstname", formValues.firstname);
        formData.append("lastname", formValues.lastname);
        formData.append("phonenumber", formValues.phonenumber);
        formData.append("dob", formValues.dob);
        formData.append("email", formValues.email);
        formData.append("maritalstatus", formValues.maritalstatus);
        formData.append("noofdependent", formValues.noofdependent);
        formData.append("educationlevel", formValues.educationlevel);
        formData.append(
          "howdidyouhearaboutus",
          formValues.howdidyouhearaboutus
        );
        formData.append("houseaddress", formValues.houseaddress);
        formData.append("stateofresidence", formValues.stateofresidence);
        formData.append("lga", formValues.lga);
        formData.append("stateoforigin", formValues.stateoforigin);
        formData.append("ippis", formValues.ippis);
        formData.append("servicenumber", formValues.servicenumber);
        formData.append("valididcard", formValues.valididcard);
        formData.append("idcardnotinclude", formValues.idcardnotinclude);
        formData.append("nkinfirstname", formValues.nkinfirstname);
        formData.append("nkinlastname", formValues.nkinlastname);
        formData.append("nkinphonenumber", formValues.nkinphonenumber);
        formData.append("nkinrelationship", formValues.nkinrelationship);
        formData.append(
          "nkinresidentialaddress",
          formValues.nkinresidentialaddress
        );
        formData.append("employer", employer?._id);
        formData.append("otheremployername", formValues.otheremployername);
        formData.append("employeraddress", formValues.employeraddress);
        formData.append("employmentstartdate", formValues.employmentstartdate);
        formData.append("employmentletter", formValues.employmentletter);
        formData.append("netmonthlyincome", formValues.netmonthlyincome);
        formData.append("totalannualincome", formValues.totalannualincome);
        formData.append("officialemail", formValues.officialemail);
        formData.append("uploadbankstatement", formValues.uploadbankstatement);
        formData.append("uploadpayslip", formValues.uploadpayslip);

        // financial info
        formData.append("salaryaccountname", formValues.salaryaccountname);
        formData.append("salaryaccountnumber", formValues.salaryaccountnumber);
        formData.append("bankcode", formValues.bankcode);
        formData.append("salarybankbranch", formValues.salarybankbranch);
        formData.append(
          "disbursementbankname",
          formValues.disbursementbankname
        );
        formData.append(
          "disbursementaccountnumber",
          formValues.disbursementaccountnumber
        );
        formData.append(
          "preferredAccountNumber",
          formValues.preferredAccountNumber
        );
        formData.append("useAnyAccount", formValues.useAnyAccount);

        formData.append("hasloan", formValues.hasloan);
        formData.append(
          "currentmonthlyplanrepaymentamount",
          formValues.currentmonthlyplanrepaymentamount
        );
        formData.append(
          "estimatedmonthlylivingexpense",
          formValues.estimatedmonthlylivingexpense
        );
        formData.append("buyoverloan", formValues.buyoverloan);
        formData.append("beneficiaryname", formValues.beneficiaryname);
        formData.append("beneficiarybank", formValues.beneficiarybank);
        formData.append(
          "beneficiaryaccountnumber",
          formValues.beneficiaryaccountnumber
        );
        formData.append("liquidationbalance", formValues.liquidationbalance);
        formData.append("deductions", formValues.deductions);
        formData.append("guarantee", formValues.guarantee);

        // agree and sign
        formData.append("acceptterms", formValues.acceptterms);
        formData.append("acceptpolicy", formValues.acceptpolicy);
        formData.append("sharemyremita", formValues.sharemyremita);
        formData.append("agreenibbsdebit", formValues.agreeNibbsDebit);
        formData.append("agreefullname", formValues.agreefullname);
        formData.append("agreedate", formValues.agreedate);
        formData.append("signature", formValues.signature);
        formData.append("marketerClientPic", formValues.marketerClientPic);
        formValues.photocapture &&
          formData.append(
            "photocapture",
            dataURItoBlob(formValues.photocapture),
            "image.jpg"
          ); // Convert data URI to Blob
        formData.append("haveagent", formValues.haveagent);
        formData.append("agentCode", agentCode?.value || null);
        formData.append("username", formValues.username);
        formData.append("password", formValues.password);
        formData.append("confirmpassword", formValues.confirmpassword);

        // send formData to database

        const res = await fetch(`${apiUrl}/api/customer/customer`, {
          method: "POST",
          mode: "cors",
          enctype: "multipart/form-data",
          body: formData,
        });

        const responsePayload = await res.json();

        if (!res.ok) {
          throw new Error(responsePayload.error);
        }
        toast.success("Customer Account Created!!!");
        deleteFromLocalStorage("onboardData");
        deleteFromLocalStorage("onboardData");
        sessionStorage.removeItem("loanFirstInfo");
        deleteFromLocalStorage("loanStep");
        fileValues.map((item) => deleteFromLocalStorage(item));
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }

    // setSubmitting(false);
  };

  // handle proceed to account creation
  const handleProceed = () => {
    const formContainer = document.querySelector(".FormContainer");
    formContainer.style.padding = "12px";
    localStorage.setItem("onboardData", JSON.stringify(ref?.current?.values));
    localStorage.setItem("loanStep", JSON.stringify({ step: "last" }));
    setShowForm(false);
  };

  const [loanOfficerOptions, setLoanOfficerOptions] = useState([]);

  useEffect(() => {
    if (allLoanOfficers) {
      const options = allLoanOfficers.map((officer) => ({
        value: officer.Code,
        label: officer.Name,
      }));
      setLoanOfficerOptions(options);
    }
  }, [allLoanOfficers]);

  const handleChangeAgentCode = (selectedOption) => {
    setAgentCode(selectedOption);
  };

  // todo: fetch banks and code
  // todo: make Bank code a selector for user to select

  // func to check if individual field is valid
  const isFieldValid = (fieldName, ref) => {
    const { isValid, errors } = ref.current;
    return isValid || !errors[fieldName];
  };

  //  Toast Notifications callback
  const notify = (msg) => {
    toast.error(msg, {
      position: "bottom-right",
    });
  };

  const [onboardData, setOnBoardData] = useState(null);
  const [isLastStep, setIsLastStep] = useState(null);

  useEffect(() => {
    setOnBoardData(JSON.parse(localStorage.getItem("onboardData")));
    setIsLastStep(JSON.parse(localStorage.getItem("loanStep")));
  }, [step]);

  // handle next step, check validation schema and move to next step
  const handleNext = () => {
    // Check that fields are valid
    if (
      isFieldValid("title", ref) &&
      isFieldValid("firstname", ref) &&
      isFieldValid("lastname", ref) &&
      isFieldValid("phonenumber", ref) &&
      isFieldValid("dob", ref) &&
      isFieldValid("gender", ref) &&
      isFieldValid("email", ref) &&
      isFieldValid("maritalstatus", ref) &&
      isFieldValid("noofdependent", ref) &&
      isFieldValid("educationlevel", ref) &&
      isFieldValid("howdidyouhearaboutus", ref) &&
      isFieldValid("houseaddress", ref) &&
      isFieldValid("stateofresidence", ref) &&
      isFieldValid("lga", ref) &&
      isFieldValid("stateoforigin", ref) &&
      isFieldValid("nkinfirstname", ref) &&
      isFieldValid("nkinlastname", ref) &&
      isFieldValid("nkinphonenumber", ref) &&
      isFieldValid("nkinrelationship", ref) &&
      isFieldValid("nkinresidentialaddress", ref) &&
      isFieldValid("valididcard", ref)
    ) {
      if (step === 1) {
        storeInLocalStorage({ key: "onbaordData", value: ref.current?.values });
        setStep(2);
        setStepImg("https://i.imgur.com/DPMDjLy.png");
      } else if (
        step === 2 &&
        (isFieldValid("employerId", ref) ||
          isFieldValid("otheremployername", ref)) &&
        isFieldValid("employeraddress", ref) &&
        // Only for Applicants who are non business Owners

        (ref.current.values.careertype !== "business owner"
          ? isFieldValid("employmentstartdate", ref)
          : true) &&
        isFieldValid("netmonthlyincome", ref) &&
        isFieldValid("totalannualincome", ref) &&
        isFieldValid("officialemail", ref) &&
        (employer?.statementRule?.ruleActive
          ? ref.current?.values.uploadbankstatement
          : true) &&
        (employer?.employerLetterRule?.ruleActive
          ? ref.current?.values.employmentletter
          : true)
      ) {
        // checkin the applicaat service duration is >= the madate rule set by the employer and exepting applicats whith no employer madate and bisiness owners
        if (
          careerType !== "business owner" && employer?.mandateRule
            ? (calcDaysDiffFromNow(ref.current?.values.employmentstartdate) <
                Number(employer?.mandateRule?.mandateDuration.split(" ")[0]) &&
                employer?.mandateRule?.allowStacking == "yes" &&
                calcDaysDiffFromNow(ref.current?.values.employmentstartdate) >=
                  parseInt(employer?.mandateRule?.secondaryDuration)) ||
              calcDaysDiffFromNow(ref.current?.values.employmentstartdate) >=
                Number(employer?.mandateRule?.mandateDuration.split(" ")[0])
            : true
        ) {
          storeInLocalStorage({
            key: "onbaordData",
            value: ref.current?.values,
          });
          setStep(3);

          setStepImg("https://i.imgur.com/DPMDjLy.png");
        } else {
          return notify(
            "Please You are not Eligible to Apply for loan on this platform"
          );
        }
      } else if (
        step === 3 &&
        isFieldValid("salaryaccountname", ref) &&
        isFieldValid("salaryaccountnumber", ref) &&
        ((ref.current.values.useAnyAccount &&
          isFieldValid("preferredAccountNumber", ref)) ||
          true)
      ) {
        storeInLocalStorage({ key: "onbaordData", value: ref.current?.values });
        setStep(4);
        setStepImg("https://i.imgur.com/DPMDjLy.png");
      } else if (
        step === 4 &&
        ref.current?.values.signature
        // && ref.current?.values.photocapture
      ) {
        storeInLocalStorage({
          key: "onbaordData",
          value: ref.current?.values,
        });
        setStep(5);
        setStepImg("https://i.imgur.com/DPMDjLy.png");
      } else {
        notify("Please Enter Valid Details for all Fields");
      }
    } else {
      notify("Please Enter Valid Details for all Fields");
    }
  };
  // handle previous step
  const handlePrevious = () => {
    if (step === 2) {
      setStep(1);
      setStepImg("https://i.imgur.com/mObbs26.png");
    } else if (step === 3) {
      setStep(2);
      setStepImg("https://i.imgur.com/mObbs26.png");
    } else if (step === 4) {
      setStep(3);
      setStepImg("https://i.imgur.com/kDbL3XN.png");
    } else if (step === 5) {
      setStep(4);
      setStepImg("https://i.imgur.com/SCIwWO7.png");
    }
  };

  const [isMarketer, setIsMarketer] = useState(null); // Track Yes/No selection

  return (
    <div className="container-fluid FormContainer">
      <div>
        {/* formik form */}
        <div>
          <Formik
            initialValues={initialValues({})}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            // enableReinitialize={true}
            innerRef={ref}
            encType="multipart/form-data"
          >
            {({ isSubmitting, values, handleBlur }) => {
              return (
                <>
                  {showForm ? (
                    <div className="container">
                      <div className="row">
                        {/* left loan form section */}
                        <div className="col-sm-12 col-md-8 FormInputBox">
                          <Form>
                            {/* loan first step section */}

                            {/* customer details section */}
                            {step === 1 && (
                              <>
                                <div id="Step2">
                                  <Headline
                                    spacer="12px 0"
                                    color="#000"
                                    text="Start your application process"
                                  />
                                  <div>
                                    {/* customer details section */}
                                    <Headline
                                      spacer="12px 0"
                                      color="#000"
                                      text="Customer Details"
                                    />
                                    {/* dropdown list */}
                                    <SelectField label="Title" name="title">
                                      <option value=""></option>
                                      <option value="Mr">Mr</option>
                                      <option value="Mrs">Mrs</option>
                                      <option value="Miss">Miss</option>
                                      <option value="Dr">Dr</option>
                                    </SelectField>

                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <TextInput
                                        label="First Name"
                                        name="firstname"
                                        type="text"
                                      />
                                      <div className="Space"></div>
                                      <TextInput
                                        label="Last Name"
                                        name="lastname"
                                        type="text"
                                      />
                                    </div>
                                    <div className="InputRow">
                                      <TextInput
                                        label="Phone Number"
                                        name="phonenumber"
                                        type="tel"
                                        placeholder="e.g. +2347047202860"
                                      />
                                      <div className="Space"></div>
                                      <SelectField
                                        label="Select Gender"
                                        name="gender"
                                      >
                                        <option value=""></option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                      </SelectField>
                                    </div>
                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <TextInput
                                        label="Date of Birth"
                                        name="dob"
                                        type="date"
                                      />
                                      <div className="Space"></div>
                                      <TextInput
                                        label="Email"
                                        name="email"
                                        type="email"
                                      />
                                    </div>

                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <SelectField
                                        label="Marital Status"
                                        name="maritalstatus"
                                      >
                                        <option value=""></option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="divorced">
                                          Divorced
                                        </option>
                                        <option value="widowed">Widowed</option>
                                      </SelectField>
                                      <div className="Space"></div>
                                      {/* <SelectField
                                        label="No of Dependents"
                                        name="noofdependent"
                                      >
                                        <option value=""></option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="more_than_7">
                                          More than 7
                                        </option>
                                      </SelectField> */}
                                      <TextInput
                                        label="No of Dependents"
                                        name="noofdependent"
                                        type="text"
                                        placeholder="1"
                                      />
                                    </div>

                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <SelectField
                                        label="Highest Level of Education"
                                        name="educationlevel"
                                      >
                                        <option value=""></option>
                                        <option value="primary">Primary</option>
                                        <option value="secondary">
                                          Secondary
                                        </option>
                                        <option value="tertiary">
                                          Tertiary
                                        </option>
                                        <option value="post graduate">
                                          Post Graduate
                                        </option>
                                      </SelectField>
                                      <div className="Space"></div>
                                      <SelectField
                                        label="How did you hear about us"
                                        name="howdidyouhearaboutus"
                                      >
                                        <option value=""></option>
                                        <option value="facebook">
                                          Facebook
                                        </option>
                                        <option value="instagram">
                                          Instagram
                                        </option>
                                        <option value="twitter">Twitter</option>
                                        <option value="linkedin">
                                          Linkedin
                                        </option>
                                        <option value="google">Google</option>
                                        <option value="friend">Friend</option>
                                        <option value="colleague">
                                          Colleague
                                        </option>
                                        <option value="agent">
                                          Boctrust Sales Agent
                                        </option>
                                        <option value="other">Other</option>
                                      </SelectField>
                                    </div>

                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <SelectField
                                        label="State of Resident"
                                        name="stateofresidence"
                                        value={state}
                                        onChange={handleSelectState}
                                      >
                                        <option value=""></option>
                                        {ngState.map((state) => (
                                          <option key={state} value={state}>
                                            {state}
                                          </option>
                                        ))}
                                      </SelectField>

                                      <div className="Space"></div>
                                      <TextInput
                                        label="House Address"
                                        name="houseaddress"
                                        type="text"
                                      />
                                    </div>

                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <SelectField
                                        label="LGA of Resident"
                                        name="lga"
                                      >
                                        <option value=""></option>
                                        {lgas?.map((lga) => (
                                          <option key={lga} value={lga}>
                                            {lga}
                                          </option>
                                        ))}
                                      </SelectField>
                                      <div className="Space"></div>
                                      <SelectField
                                        label="State of Origin"
                                        name="stateoforigin"
                                      >
                                        <option value=""></option>
                                        {ngState.map((state) => (
                                          <option key={state} value={state}>
                                            {state}
                                          </option>
                                        ))}
                                      </SelectField>
                                    </div>

                                    {/* Staff ID card upload */}
                                    <div>
                                      {careerType?.toLowerCase() ===
                                      "government employee" ? (
                                        <div>
                                          <div className="InputRow">
                                            <TextInput
                                              label="IPPIS Number"
                                              name="ippis"
                                              type="text"
                                            />
                                            <div className="Space"></div>
                                            <TextInput
                                              label="Service Number"
                                              name="servicenumber"
                                              type="text"
                                            />
                                          </div>

                                          {/* Input row sectioin */}
                                          <div className="FileUploadBox ">
                                            <Headline
                                              color="#000"
                                              fontSize="22px"
                                              text={
                                                values.careertype !==
                                                "business owner"
                                                  ? "Upload Staff ID Card"
                                                  : "Upload ID Card"
                                              }
                                            />
                                            <div>
                                              <input
                                                type="file"
                                                name="valididcard"
                                                onBlur={handleBlur}
                                                accept="image/png, .jpg, .jpeg"
                                                className="UploadFile"
                                                onChange={(e) =>
                                                  convertFile(e, setIdCard)
                                                }
                                              />
                                              <ErrorMessage
                                                name={"valididcard"}
                                                component="div"
                                                className="Error"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="FileUploadBox ">
                                          <Headline
                                            color="#000"
                                            fontSize="22px"
                                            text="Upload Valid ID Card"
                                          />

                                          <input
                                            type="file"
                                            name="valididcard"
                                            onBlur={handleBlur}
                                            accept="image/png, .svg, .jpg, .jpeg, .pdf"
                                            className="UploadFile"
                                            onChange={(e) =>
                                              convertFile(e, setIdCard)
                                            }
                                          />
                                          <ErrorMessage
                                            name={"valididcard"}
                                            component="div"
                                            className="Error"
                                          />
                                        </div>
                                      )}
                                      <hr className="hLine" />
                                    </div>

                                    {/* Next of kin information */}
                                    <div className="NextOfKin">
                                      <Headline
                                        fontSize="24px"
                                        spacer="48px 0 0 0"
                                        align="left"
                                        color="#000"
                                        text="Next of Kin Information"
                                      />
                                      {/* Input row sectioin */}
                                      <div className="InputRow">
                                        <TextInput
                                          label="First Name"
                                          name="nkinfirstname"
                                          type="text"
                                        />
                                        <div className="Space"></div>
                                        <TextInput
                                          label="Last Name"
                                          name="nkinlastname"
                                          type="text"
                                        />
                                      </div>

                                      {/* Input row sectioin */}
                                      <div className="InputRow">
                                        <TextInput
                                          label="Phone Number"
                                          name="nkinphonenumber"
                                          type="tel"
                                        />
                                        <div className="Space"></div>
                                        <TextInput
                                          label="Residential Address"
                                          name="nkinresidentialaddress"
                                          type="text"
                                        />
                                      </div>
                                      {/* select relationship */}
                                      <SelectField
                                        label="Select Relationship"
                                        name="nkinrelationship"
                                      >
                                        <option value=""></option>
                                        <option value="father">Father</option>
                                        <option value="mother">Mother</option>
                                        <option value="brother">Brother</option>
                                        <option value="sister">Sister</option>
                                        <option value="husband">Husband</option>
                                        <option value="wife">Wife</option>
                                        <option value="son">Son</option>
                                        <option value="daughter">
                                          Daughter
                                        </option>
                                        <option value="uncle">Uncle</option>
                                        <option value="aunt">Aunt</option>
                                        <option value="nephew">Nephew</option>
                                        <option value="niece">Niece</option>
                                        <option value="cousin">Cousin</option>
                                        <option value="other">other</option>
                                      </SelectField>
                                    </div>

                                    <div className="ButtonContainer">
                                      <button
                                        type="button"
                                        onClick={handlePrevious}
                                        className="BtnAction BtnPrimary"
                                      >
                                        Previous
                                      </button>
                                      {/* next form page btn */}
                                      <button
                                        type="submit"
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                        className="BtnAction BtnSecondary"
                                      >
                                        Next
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* employer information */}
                            {step === 2 && (
                              <>
                                <div id="Step3">
                                  <Headline
                                    spacer="12px 0"
                                    color="#000"
                                    text={
                                      careerType === "business owner"
                                        ? "Business Details"
                                        : "Employer Details"
                                    }
                                  />
                                  {/* to be change to dropdown list and input field */}

                                  <div>
                                    {/* dropdown list */}
                                    {careerType === "government employee" && (
                                      <SelectField
                                        label="Employer Name"
                                        name="employerId"
                                      >
                                        <option value=""></option>
                                        {employers?.map((employer) => {
                                          setEmployerId(
                                            ref.current?.values.employerId
                                          );
                                          return (
                                            <option
                                              key={employer._id}
                                              value={employer._id}
                                            >
                                              {employer.employersName}
                                            </option>
                                          );
                                        })}
                                        <option value="other">Other</option>
                                      </SelectField>
                                    )}

                                    {/* type employer name if not in list */}
                                    {(careerType !== "government employee" ||
                                      values?.employerId === "other") && (
                                      <TextInput
                                        label={
                                          careerType === "business owner"
                                            ? "Business Name"
                                            : "Enter Employers Name"
                                        }
                                        name="otheremployername"
                                        type="text"
                                        placeholder="Type  name here"
                                      />
                                    )}
                                  </div>

                                  <TextInput
                                    label={
                                      careerType === "business owner"
                                        ? "Business Address"
                                        : "Employer Address"
                                    }
                                    name="employeraddress"
                                    type="text"
                                  />

                                  {careerType !== "business owner" && (
                                    <TextInput
                                      label="Employment Start Date"
                                      name="employmentstartdate"
                                      type="date"
                                    />
                                  )}

                                  <TextInput
                                    label="Net Monthly Income"
                                    name="netmonthlyincome"
                                    type="text"
                                  />

                                  <TextInput
                                    label="Total Annual Income"
                                    name="totalannualincome"
                                    type="text"
                                  />

                                  <TextInput
                                    label="Official Email"
                                    name="officialemail"
                                    type="text"
                                  />

                                  {/* pay slip upload private employee*/}
                                  {careerType?.toLowerCase() ===
                                  "private employee" ? (
                                    <div className="FileUploadBox ">
                                      <Headline
                                        color="#000"
                                        fontSize="22px"
                                        text="Upload Pay Slip"
                                      />
                                      <input
                                        type="file"
                                        name="uploadpayslip"
                                        onBlur={handleBlur}
                                        accept="image/png, .svg, .jpg, .jpeg"
                                        className="UploadFile"
                                        onChange={(e) =>
                                          convertFile(e, setPaySlip)
                                        }
                                      />
                                      <ErrorMessage
                                        name={"uploadpayslip"}
                                        component="div"
                                        className="Error"
                                      />
                                    </div>
                                  ) : null}

                                  {/* Bank Statement and Employement Letter fro government Employeee*/}

                                  <div className="d-flex gap-3">
                                    {showBankStatement ? (
                                      <div className="FileUploadBox ">
                                        <Headline
                                          color="#000"
                                          fontSize="22px"
                                          text="Upload Bank Statement"
                                        />
                                        <div>
                                          <input
                                            type="file"
                                            name="uploadbankstatement"
                                            onBlur={handleBlur}
                                            accept="image/png, .svg, .jpg, .jpeg"
                                            className="UploadFile"
                                            onChange={(e) =>
                                              convertFile(e, setBankStatements)
                                            }
                                          />
                                          <ErrorMessage
                                            name={"uploadbankstatement"}
                                            component="div"
                                            className="Error"
                                          />
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>

                                  <div className="d-flex gap-3">
                                    {showEmploymentLetter ? (
                                      <div className="FileUploadBox ">
                                        <Headline
                                          color="#000"
                                          fontSize="22px"
                                          text="Upload Employment Letter"
                                        />
                                        <input
                                          type="file"
                                          name="employmentletter"
                                          accept="image/png, .svg, .jpg, .jpeg"
                                          className="UploadFile"
                                          onChange={(e) =>
                                            convertFile(e, setEmploymentLetter)
                                          }
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="ButtonContainer">
                                  <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="BtnAction BtnPrimary"
                                  >
                                    Previous
                                  </button>
                                  {/* next form page btn */}
                                  <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={
                                      isSubmitting ||
                                      (careerType === "government employee" &&
                                        employerId === "other")
                                    }
                                    className="BtnAction BtnSecondary"
                                  >
                                    Next
                                  </button>
                                </div>
                              </>
                            )}

                            {/* financial information */}
                            {step === 3 && (
                              <>
                                <div id="Step4">
                                  <Headline
                                    spacer="12px 0"
                                    color="#000"
                                    text="Financial Information"
                                  />
                                  <div>
                                    <Headline
                                      align="left"
                                      fontSize="22px"
                                      spacer="35px 0 -16px 0"
                                      color="#000"
                                      text={
                                        careerType === "business owner"
                                          ? "Business Account Details"
                                          : "Salary Account Details"
                                      }
                                    />

                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <TextInput
                                        onBlur={() => {
                                          ref.current?.setFieldValue(
                                            "disbursementbankname",
                                            values.salaryaccountname
                                          );
                                        }}
                                        label="Salary Account Name"
                                        name="salaryaccountname"
                                        type="text"
                                      />
                                      <div className="Space"></div>
                                      {/* dropdown list */}
                                      <SelectField
                                        label="Bank Name"
                                        name="bankcode"
                                      >
                                        <option value="">Select</option>
                                        {/* <option value="000">No Bank</option> */}
                                        {banks?.map((bank) => {
                                          return (
                                            <option
                                              key={bank.ID}
                                              value={bank.Code}
                                            >
                                              {bank.Name}
                                            </option>
                                          );
                                        })}
                                      </SelectField>
                                    </div>
                                  </div>
                                  <div className="InputRow">
                                    <TextInput
                                      onBlur={() => {
                                        ref.current?.setFieldValue(
                                          "disbursementaccountnumber",
                                          values.salaryaccountnumber
                                        );
                                      }}
                                      label="Salary Account No."
                                      name="salaryaccountnumber"
                                      type="text"
                                    />
                                    <div className="Space"></div>
                                    <TextInput
                                      label="Salary Bank Branch"
                                      name="salarybankbranch"
                                      type="text"
                                    />
                                  </div>

                                  <div className="InputRow">
                                    <TextInput
                                      label="Disbursement Acc. Name"
                                      name="disbursementbankname"
                                      type="text"
                                      disabled
                                    />
                                    <div className="Space"></div>

                                    <TextInput
                                      label="Disbursement Acc. No."
                                      name="disbursementaccountnumber"
                                      type="text"
                                      disabled
                                    />
                                  </div>

                                  <div id="ExistingLoan">
                                    <Headline
                                      align="left"
                                      fontSize="20px"
                                      spacer="28px 0 12px 0"
                                      color="#000"
                                      text="Do you have any existing loan?"
                                    />
                                    <div className="RadioRow">
                                      <div className="RadioField">
                                        <label>
                                          <Field
                                            type="radio"
                                            name="hasloan"
                                            value="yes"
                                          />
                                        </label>
                                        Yes
                                      </div>
                                      <div className="RadioField">
                                        <label>
                                          <Field
                                            type="radio"
                                            name="hasloan"
                                            value="no"
                                          />
                                        </label>
                                        No
                                      </div>
                                    </div>
                                    {values.hasloan === "yes" && (
                                      <div className="InputRow">
                                        <div>
                                          <img
                                            src="/images/naira.png"
                                            alt=""
                                            className="NairaI FinNaira"
                                          />
                                          <TextInput
                                            label="Current monthly plan repayment amount"
                                            name="currentmonthlyplanrepaymentamount"
                                            type="text"
                                          />
                                        </div>
                                        <div className="Space"></div>
                                        <div>
                                          <img
                                            src="/images/naira.png"
                                            alt=""
                                            className="NairaI
                                          FinNaira FinNaira2"
                                          />
                                          <TextInput
                                            label="Estimated monthly living expense"
                                            name="estimatedmonthlylivingexpense"
                                            type="text"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <Headline
                                      align="left"
                                      fontSize="22px"
                                      spacer="28px 0 12px 0"
                                      color="#000"
                                      text="Is this a Buy Over Loan?"
                                    />
                                    <div className="RadioRow">
                                      <div className="RadioField">
                                        <label>
                                          <Field
                                            type="radio"
                                            name="buyoverloan"
                                            value="yes"
                                          />
                                        </label>
                                        Yes
                                      </div>
                                      <div className="RadioField">
                                        <label>
                                          <Field
                                            type="radio"
                                            name="buyoverloan"
                                            value="no"
                                          />
                                        </label>
                                        No
                                      </div>
                                    </div>
                                  </div>

                                  {values.buyoverloan === "yes" ? (
                                    <div id="BuyBackLoan">
                                      {/* Input row sectioin */}
                                      <div className="InputRow">
                                        <TextInput
                                          label="Beneficiary Name"
                                          name="beneficiaryname"
                                          type="text"
                                        />
                                        <div className="Space"></div>
                                        <TextInput
                                          label="Bank Name"
                                          name="beneficiarybank"
                                          type="text"
                                        />
                                      </div>
                                      <div className="InputRow">
                                        <TextInput
                                          label="Account Number"
                                          name="beneficiaryaccountnumber"
                                          type="text"
                                        />
                                        <div className="Space"></div>
                                        <TextInput
                                          label="Liquidation Balance"
                                          name="liquidationbalance"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  ) : null}

                                  {/* have boctrust agent */}
                                  <div>
                                    <Headline
                                      align="left"
                                      fontSize="20px"
                                      spacer="12px 0"
                                      color="#000"
                                      text="Do you have a loan Officer?"
                                    />
                                    <div className="RadioRow">
                                      <div className="RadioField">
                                        <label>
                                          <Field
                                            type="radio"
                                            name="haveagent"
                                            value="yes"
                                          />
                                        </label>
                                        Yes
                                      </div>
                                      <div className="RadioField">
                                        <label>
                                          <Field
                                            type="radio"
                                            name="haveagent"
                                            value="no"
                                          />
                                        </label>
                                        No
                                      </div>
                                    </div>
                                    {values.haveagent === "yes" && (
                                      <div>
                                        <label htmlFor="agentCode">
                                          Select Loan Officer
                                        </label>
                                        <Select
                                          name="agentCode"
                                          id="agentCode"
                                          options={loanOfficerOptions}
                                          value={agentCode} // Handle missing agentCode
                                          onChange={handleChangeAgentCode}
                                          placeholder="Search Loan Officer"
                                          isClearable
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div id="Repayment">
                                    <Headline
                                      fontSize="22px"
                                      color="#000"
                                      align="left"
                                      text="Method of Loan Repayment"
                                    />
                                    <div className="DeductionFrom">
                                      <Headline
                                        fontSize="16px"
                                        color="#000"
                                        align="left"
                                        text="1.0 Loan against income/earnings"
                                      />

                                      {careerType?.toLowerCase() ===
                                      "government employee" ? (
                                        <div>
                                          {calcDaysDiffFromNow(
                                            values.employmentstartdate
                                          ) <
                                            parseInt(
                                              employer?.mandateRule?.mandateDuration?.split(
                                                " "
                                              )[0]
                                            ) &&
                                            employer?.mandateRule
                                              ?.allowStacking == "yes" &&
                                            calcDaysDiffFromNow(
                                              values.employmentstartdate
                                            ) >=
                                              parseInt(
                                                employer.mandateRule
                                                  ?.secondaryDuration
                                              ) && (
                                              <div>
                                                <label>
                                                  <Field
                                                    type="radio"
                                                    name="deductions"
                                                    value="remita"
                                                  />
                                                </label>
                                                Deduction from salary via Remita
                                                (Government employee)
                                              </div>
                                            )}

                                          {calcDaysDiffFromNow(
                                            values.employmentstartdate
                                          ) >=
                                            parseInt(
                                              employer?.mandateRule?.mandateDuration?.split(
                                                " "
                                              )[0]
                                            ) && (
                                            <div>
                                              <label>
                                                <Field
                                                  type="radio"
                                                  name="deductions"
                                                  value="ippis"
                                                />
                                              </label>
                                              Deduction from source via IPPIS
                                              (Government employee)
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <>
                                          <div>
                                            <label>
                                              <Field
                                                type="radio"
                                                name="deductions"
                                                value="standingOrder"
                                              />
                                            </label>
                                            Standing order payment (ISPO/EDDM)
                                          </div>

                                          <div>
                                            <label>
                                              <Field
                                                type="radio"
                                                name="deductions"
                                                value="cheque"
                                              />
                                            </label>
                                            Post-dated cheque
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    <div className="DeductionFrom">
                                      <Headline
                                        fontSize="16px"
                                        color="#000"
                                        align="left"
                                        text="2.0 Guarantee"
                                      />
                                      <div>
                                        <label>
                                          <Field
                                            type="radio"
                                            name="guarantee"
                                            value="guranteeofemployer"
                                          />
                                        </label>
                                        Guarantee of Employer
                                      </div>
                                      <div>
                                        <label>
                                          <Field
                                            type="radio"
                                            name="guarantee"
                                            value="individualguarantee"
                                          />
                                        </label>
                                        Individual Guarantee
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shows up is customer BVN is already in use with an account */}
                                  {isBVNInUse ? (
                                    <div className="bvnInUse__wrapper">
                                      <div>
                                        <BsInfoSquareFill
                                          size={50}
                                          color="white"
                                        />
                                        <p>
                                          It looks like your BVN is already
                                          linked to an account with our
                                          microfinance bank. Kindly provide your
                                          account number to proceed.
                                        </p>
                                      </div>

                                      <TextInput
                                        label="Preferred Account Number"
                                        name="preferredAccountNumber"
                                        type="text"
                                        disabled={values.useAnyAccount}
                                        placeholder="0000000000"
                                        onChange={(e) => {
                                          accountCheckError &&
                                            setAccountCheckError("");
                                          accountCheckMessage &&
                                            setAccountCheckMessage("");
                                          checkIfAccountValid(e.target.value);
                                        }}
                                      />
                                      <div className="bvnFirstStep__info">
                                        {accountCheckError ? (
                                          <span className="error__msg">
                                            <IoCloseCircleOutline />{" "}
                                            {accountCheckError}
                                          </span>
                                        ) : accountCheckMessage ? (
                                          <span className="info__msg">
                                            <IoCheckmarkCircleOutline />
                                            {accountCheckMessage}
                                          </span>
                                        ) : accountCheckLoading ? (
                                          <span className="loading__msg">
                                            <PageLoader width="16px" />{" "}
                                            Loading...
                                          </span>
                                        ) : null}
                                      </div>
                                      <div>
                                        <label className="chb__label">
                                          <Field
                                            type="checkbox"
                                            name="useAnyAccount"
                                            onChange={(e) => {
                                              const isChecked =
                                                e.target.checked;
                                              ref.current.setFieldValue(
                                                "useAnyAccount",
                                                isChecked
                                              );
                                              if (isChecked) {
                                                ref.current.setFieldValue(
                                                  "preferredAccountNumber",
                                                  ""
                                                );
                                              }
                                            }}
                                          />
                                        </label>{" "}
                                        I dont have any of my Account Number at
                                        the moment. Use any found account
                                      </div>
                                    </div>
                                  ) : null}
                                </div>

                                <div className="ButtonContainer">
                                  <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="BtnAction BtnPrimary"
                                  >
                                    Previous
                                  </button>
                                  {/* next form page btn */}
                                  <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={
                                      isSubmitting ||
                                      !ref.current?.values.guarantee
                                    }
                                    className="BtnAction BtnSecondary"
                                  >
                                    Next
                                  </button>
                                </div>
                              </>
                            )}

                            {/* agree and sign */}
                            {step === 4 && (
                              <>
                                <div id="Step5">
                                  <Headline
                                    spacer="12px 0"
                                    color="#000"
                                    text="Agree, Sign and Submit"
                                  />

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <TextInput
                                      label="Full Name"
                                      name="agreefullname"
                                      type="text"
                                    />
                                    <div className="Space"></div>
                                    <TextInput
                                      label="Date"
                                      name="agreedate"
                                      type="date"
                                    />
                                  </div>

                                  {/* signature upload */}
                                  <div className="Signature">
                                    <Headline
                                      spacer="14px 28px"
                                      fontSize="18px"
                                      text="Upload Signature (Sign on white paper)"
                                    />

                                    <div>
                                      <input
                                        type="file"
                                        name="signature"
                                        accept="image/png, .png .jpg, .jpeg,"
                                        onBlur={handleBlur}
                                        className="UploadFile"
                                        onChange={(e) => {
                                          const file = e.currentTarget.files[0];
                                          if (file && file.size > 200 * 1024) {
                                            // Manually set validation error for file size
                                            setSigError(true);

                                            setFieldError(
                                              "signature",
                                              "File size exceeds 200KB"
                                            );
                                            return;
                                          } else {
                                            setSigError(false);
                                          }
                                          convertFile(e, setSignature); // Proceed with valid file
                                        }}
                                      />
                                      {sigError && (
                                        <p style={{ color: "red" }}>
                                          File Limit Exceeds 200 KB
                                        </p>
                                      )}
                                      <ErrorMessage
                                        name="signature"
                                        component="div"
                                        className="Error"
                                      />
                                    </div>
                                  </div>

                                  <hr />

                                  <div>
                                    <Headline
                                      align="left"
                                      fontSize="20px"
                                      spacer="12px 0"
                                      color="#000"
                                      text="Declaration & Agreement"
                                    />

                                    <div className="DeductionFrom">
                                      <div>
                                        <label>
                                          <Field
                                            type="checkbox"
                                            name="acceptterms"
                                          />
                                        </label>
                                        I have read and understand and accept
                                        the{" "}
                                        <a href="/terms" target="_blank">
                                          terms and condition
                                        </a>{" "}
                                        of this service.
                                      </div>
                                      <div>
                                        <label>
                                          <Field
                                            type="checkbox"
                                            name="acceptpolicy"
                                          />
                                        </label>
                                        I accept the{" "}
                                        <a href="/privacy">Privacy Policy</a>
                                      </div>
                                    </div>
                                    <div className="DeductionFrom">
                                      <div>
                                        <label>
                                          <Field
                                            type="checkbox"
                                            name="agreeNibbsDebit"
                                          />
                                        </label>
                                        I agree to the{" "}
                                        <button
                                          onClick={() =>
                                            handleGeneratingFile({
                                              accountNumber:
                                                ref.current.values
                                                  .salaryaccountnumber,
                                              address:
                                                ref.current.values.houseaddress,
                                              noOfMonth:
                                                ref.current.values
                                                  .numberofmonth,
                                              amount:
                                                Number(loanRepaymentTotal),
                                              bankCode:
                                                ref.current.values.bankcode,
                                              branch:
                                                ref.current.values
                                                  .salarybankbranch,
                                              customerSignature:
                                                ref.current.values.signature,
                                              name: `${ref.current.values.firstname} ${ref.current.values.lastname}`,
                                              witnessAddress:
                                                settings.mandateWitnessAddress,
                                              witnessName:
                                                settings.mandateWitnessName,
                                              witnessOccupation:
                                                settings.mandateWitnessOcupation,
                                              witnessSignature:
                                                settings.mandateWitnessSignature,
                                            })
                                          }
                                          style={{
                                            color:
                                              "rgba(var(--bs-link-color-rgb)",
                                            border: "0",
                                            background: "transparent",
                                            padding: "0",
                                          }}
                                        >
                                          NIBSS Direct Debit mandate
                                        </button>
                                      </div>
                                    </div>
                                    <div className="DeductionFrom">
                                      {values.deductions === "remita" ? (
                                        <div>
                                          <label>
                                            <Field
                                              type="checkbox"
                                              name="sharemyremita"
                                            />
                                          </label>
                                          I agree to share my Remita data on
                                          this platform
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>

                                  {/* selfi photoshot */}
                                  <div className="SelfiCon">
                                    <Headline
                                      align="left"
                                      fontSize="20px"
                                      spacer="12px 0"
                                      color="#000"
                                      text="Confirm your Identity"
                                    />
                                    <div id="CapturePhoto">
                                      {openCapture ? (
                                        <PhotoCapture func={setCaptureImg} />
                                      ) : (
                                        <PhotocaptureStatic
                                          func={handleOpenCapture}
                                        />
                                      )}
                                    </div>
                                    <p>
                                      Your identification document will help us
                                      to validate your identity.
                                    </p>
                                  </div>
                                  {/*  marketerClientPic Upload */}
                                  {
                                    <div className="">
                                      <Headline
                                        align="left"
                                        fontSize="20px"
                                        spacer="12px 0"
                                        color="#000"
                                        text="Are you a DSA / Marketer?  "
                                      />

                                      {/* Radio Buttons */}
                                      <div
                                        style={{ marginBottom: "16px" }}
                                        className="dsa__form"
                                      >
                                        <label>
                                          <input
                                            type="radio"
                                            name="isMarketer"
                                            value="yes"
                                            onChange={() => setIsMarketer(true)}
                                          />
                                          Yes
                                        </label>
                                        <label style={{ marginLeft: "16px" }}>
                                          <input
                                            type="radio"
                                            name="isMarketer"
                                            value="no"
                                            onChange={() =>
                                              setIsMarketer(false)
                                            }
                                          />
                                          No
                                        </label>
                                      </div>

                                      {/* Conditionally Render File Upload */}
                                      {isMarketer && (
                                        <>
                                          <p>Upload client picture below.</p>
                                          <div>
                                            <input
                                              type="file"
                                              name="marketerClientPic"
                                              accept="image/png, .svg, .jpg, .jpeg, .pdf"
                                              onBlur={handleBlur}
                                              className="UploadFile"
                                              onChange={(e) =>
                                                convertFile(
                                                  e,
                                                  setMarketerClientPic
                                                )
                                              }
                                            />
                                            <ErrorMessage
                                              name={"signature"}
                                              component="div"
                                              className="Error"
                                            />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  }

                                  <div className="ButtonContainer">
                                    <button
                                      type="button"
                                      onClick={handlePrevious}
                                      className="BtnAction BtnPrimary"
                                    >
                                      Previous
                                    </button>
                                    {/* next form page btn */}
                                    {!values.acceptterms ||
                                    !values.acceptpolicy ||
                                    !values.agreefullname ||
                                    !values.agreedate ||
                                    !values.signature ||
                                    // !values.photocapture ||
                                    !values.agreeNibbsDebit ||
                                    (values.deductions === "remita" &&
                                      !values.sharemyremita) ? (
                                      <button
                                        type="button"
                                        disabled={true}
                                        className="BtnAction btnDisabled"
                                      >
                                        Review
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                        className="BtnAction BtnSecondary"
                                      >
                                        Review
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}

                            {/* review and proceed */}
                            {step === 5 && (
                              <>
                                <div id="Step6">
                                  <Headline
                                    spacer="28px 0 48px 0"
                                    color="#000"
                                    text="Review your Application Details to Proceed"
                                  />
                                  <Headline
                                    spacer="18px 08px 0"
                                    color="#000"
                                    text="Click to edit any information you want to change"
                                    fontSize="12px"
                                    align="left"
                                  />

                                  <div>
                                    <ConfirmData career={values.careertype} />
                                  </div>

                                  <div className="ButtonContainer">
                                    {/* proceed btn */}
                                    <button
                                      type="button"
                                      onClick={handleProceed}
                                      className="BtnAction BtnSecondary"
                                    >
                                      Proceed
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </Form>
                        </div>

                        {/* right loan step section */}
                        <div className="col-sm-12 col-md-4 Step">
                          <img src={stepImg} alt={step} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="CreateAccount">
                      <CreateAccount
                        handleSubmit={handleSubmit}
                        phoneNumber={ref.current?.values.phonenumber}
                        customerEmail={ref.current?.values.email}
                        customerName={ref.current?.values.firstname}
                        setShowLoanForm={setShowForm}
                      />
                    </div>
                  )}
                </>
              );
            }}
          </Formik>
        </div>
      </div>

      {/*  reconfirm modal */}
      {showReconfirmBvn && (
        <ReconfirmBvn
          show={showReconfirmBvn}
          setShow={setShowReconfirmBvn}
          setFirstStepData={setFirstStepData}
        />
      )}
    </div>
  );
});

LoanForm.propTypes = {
  data: PropTypes.any,
};

export default LoanForm;

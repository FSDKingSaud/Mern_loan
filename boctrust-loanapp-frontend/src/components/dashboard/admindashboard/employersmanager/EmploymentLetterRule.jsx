import { useState } from "react";
import { useDispatch } from "react-redux";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import { toast } from "react-toastify";
import EmployerLetterRuleForm from "./molecules/EmployerLetterRuleForm";
import { fetchEmployerLetterRules } from "../../../../redux/reducers/employerLetterRuleReducer";
import EmployerLetterRuleList from "./molecules/EmployerLetterRuleList";
import apiClient from "../../../../lib/axios";

const initialValues = {
  ruleTitle: "",
  maximumTenure: "",
  maximumAmount: "",
  logicalRelationship: "AND",
};

const EmploymentLetterRule = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const addRule = async ({ values }) => {
    // Handle form submission logic here
    await apiClient.post(`/employer-letter-rule`, values);
    await dispatch(fetchEmployerLetterRules());
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addRule({ values });
      // Reset form after submission
      resetForm();

      // Set message after successful submission
      setMessage("Employment Letter rule added successfully");
      toast.success("Employment Letter rule added successfully");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      toast.error("Somthing Went Wrong");
      console.log(error);
    }
  };
  return (
    <div className="employer__letterContainer">
      <EmployerLetterRuleForm
        formTitle={"Create New Employment Letter Rule"}
        handleSubmit={handleSubmit}
        message={message}
        initialValues={initialValues}
        isLoading={isLoading}
      />

      <EmployerLetterRuleList />
    </div>
  );
};

export default EmploymentLetterRule;

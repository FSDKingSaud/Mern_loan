import { useState } from "react";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import { toast } from "react-toastify";

// toast styles
import "react-toastify/dist/ReactToastify.css";

import MandateRuleList from "./molecules/MandateRuleList";
import MandateRuleForm from "./molecules/MandateRuleForm";
import { fetchMandateRules } from "../../../../redux/reducers/mandateRuleReducer";
import { useDispatch } from "react-redux";
import apiClient from "../../../../lib/axios";

const MandateRules = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const addMandateRule = async ({ values }) => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_BASE_URL;
      // Handle form submission logic here
      await apiClient.post(`${apiUrl}/api/mandate-rule`, values);
      await dispatch(fetchMandateRules());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addMandateRule({ values });
      // Reset form after submission
      resetForm();

      // Set message after successful submission
      setMessage("Mandate rule added successfully");
      toast.success("Mandate rule added successfully");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    mandateTitle: "",
    mandateDuration: "",
    allowStacking: "",
    secondaryDuration: "",
  };

  return (
    <div className="add__mandateRule">
      <MandateRuleForm
        formTitle={"Create New Mandate Rule"}
        handleSubmit={handleSubmit}
        message={message}
        initialValues={initialValues}
        isLoading={isLoading}
      />

      <MandateRuleList />
    </div>
  );
};

export default MandateRules;

import { useState } from "react";
import { useDispatch } from "react-redux";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import { toast } from "react-toastify";
import { fetchStatementRules } from "../../../../redux/reducers/statementRuleReducer";
import StatementRuleForm from "./molecules/StatementRuleForm";
import StatementRuleList from "./molecules/StatementRuleList";
import apiClient from "../../../../lib/axios";

const initialValues = {
  ruleTitle: "",
  maximumTenure: "",
  maximumAmount: "",
  logicalRelationship: "AND",
};

const StatementRules = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const addStatementRule = async ({ values }) => {
    try {
      setIsLoading(true);
      
      // Handle form submission logic here
      await apiClient.post(`/statement-rule`, values);
      
      await dispatch(fetchStatementRules());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addStatementRule({ values });
      // Reset form after submission
      resetForm();

      // Set message after successful submission
      setMessage("Statement rule added successfully");
      toast.success("Statement rule added successfully");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add__statementContainer">
      <StatementRuleForm
        formTitle={"Create New Statement Rule"}
        handleSubmit={handleSubmit}
        message={message}
        initialValues={initialValues}
        isLoading={isLoading}
      />

      <StatementRuleList />
    </div>
  );
};

export default StatementRules;

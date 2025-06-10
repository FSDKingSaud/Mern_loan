import apiClient from "../../../../lib/axios";

const updateSalaryHistory = async (
  loanId,
  loanStatus = "pending",
) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;

  // update customer data with remita details
  const remitaData = {
    loanStatus,
    loanId
  };

  const response = await apiClient.put(`/remita/update-loan-status`, remitaData);

  return response;
};

export default updateSalaryHistory;
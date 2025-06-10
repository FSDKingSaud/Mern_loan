import apiClient from "../../../lib/axios";

const loginCustomerOnServer = async (username, password) => {
 
  const loginData = {
    username: username,
    password: password,
  };

  try {
    const { data } = await apiClient.post(`/customer/login`, loginData);

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, error: "Login failed" };
  }
};

export default loginCustomerOnServer;

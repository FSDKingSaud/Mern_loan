import apiClient from "../../../lib/axios";

const loginUserOnServer = async (username, password) => {
  const loginData = {
    username: username,
    password: password,
  };

  try {
    const { data } = await apiClient.post(`/admin/login`, loginData);

    return data;
  } catch (error) {
    alert(error?.response?.data?.message)
    console.error("Error logging in:", error);
    return { success: false, error: "Login failed" };
  }
};

export default loginUserOnServer;

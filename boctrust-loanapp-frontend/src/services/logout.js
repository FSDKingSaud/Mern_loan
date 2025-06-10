import axios from "axios";

export const handleLogout = async () => {
  // Call refresh endpoint to get a new access token
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sharedAuth/logout`,
    {
      withCredentials: true, // Send the HttpOnly cookie with this request
    }
  );

  

  return response.data;
};

import axios from "axios";

export const sendOTP = async (phoneNumber) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/otp/send`,
    {
      phoneNumber,
    }
  );

  return response.data;
};

export const verifyOTP = async ({ pinId, pin }) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/otp/verify`,
    {
      pinId,
      pin,
    }
  );

  return response.data;
};

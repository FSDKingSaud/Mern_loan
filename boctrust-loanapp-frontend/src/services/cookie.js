import apiClient from "../lib/axios";

export const acceptConsentCookie = async () => {
  try {
    await apiClient.post("/consent-cookie/accept");
  } catch (error) {
    console.error(error?.response?.data?.error);
  }
};
export const rejectConsentCookie = async () => {
  try {
    await apiClient.post("/consent-cookie/reject");
  } catch (error) {
    console.error(error?.response?.data?.error);
  }
};

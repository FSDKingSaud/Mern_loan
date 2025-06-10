import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setToken } from "../redux/reducers/adminAuthReducer";
import { getRefreshToken } from "../services/refreshToken";
import { handleLogout } from "../services/logout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  
  withCredentials: true,
});

// Axios interceptor setup function
export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.adminAuth.token);

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        if (accessToken && !config._retry) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const { token: newAccessToken } = await getRefreshToken();

            dispatch(setToken(newAccessToken));

            // Update Authorization header
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            // Ensure the Content-Type is preserved
            if (
              originalRequest.headers["Content-Type"] === "multipart/form-data"
            ) {
              originalRequest.headers["Content-Type"] = "multipart/form-data";
            }
            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token request failed", refreshError);
            await handleLogout();
            dispatch(logoutUser());
            navigate("/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptors on component unmount
    // return () => {
    //   apiClient.interceptors.request.eject(requestInterceptor);
    //   apiClient.interceptors.response.eject(responseInterceptor);
    // };
  }, [accessToken, dispatch, navigate]);
};

export default apiClient;

import { useEffect } from "react";
import axios from "axios";

let activityTimeout;

const useAdminActivity = (onLogout) => {
  const resetInactivityTimeout = () => {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
      onLogout();
    }, 5 * 60 * 1000); // 5 minutes
  };

  useEffect(() => {
    // Reset timeout on mouse or keyboard activity
    const handleActivity = () => resetInactivityTimeout();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    resetInactivityTimeout();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearTimeout(activityTimeout);
    };
  }, []);
};

export default useAdminActivity;

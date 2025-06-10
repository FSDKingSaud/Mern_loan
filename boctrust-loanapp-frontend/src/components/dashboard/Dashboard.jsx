import { useDispatch, useSelector } from "react-redux";
import "./Dashboard.css";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./admindashboard/dashboardhome/AdminDashboard";
import useAdminActivity from "../../../hooks/useAdminActivity";

import PageLoader from "./shared/PageLoader";
import usePersistUser from "../../hooks/usePersistUser";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../services/logout";
import { logoutUser } from "../../redux/reducers/adminAuthReducer";

const Dashboard = () => {
  // show dashboard base on current user admin/customer

  const { user: currentUser } = useSelector((state) => state.adminAuth);
  usePersistUser();
  const dispatch = useDispatch();


  const navigate = useNavigate();

  const pullOut = async () => {
    console.log("LOGGING OUT  ");
    try {
      await handleLogout();
      dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  useAdminActivity(() => {
    pullOut();
  });

  return (
    <>
      {currentUser?.userType === "staff" ||
        currentUser?.userType === "super_admin" ? (
        <AdminDashboard />
      ) : currentUser ? (
        <CustomerDashboard />
      ) : (
        <div
          style={{
            display: "grid",
            height: "90vh",
            placeContent: "center",
          }}
        >
          <PageLoader />
        </div>
      )}
    </>
  );
};

export default Dashboard;

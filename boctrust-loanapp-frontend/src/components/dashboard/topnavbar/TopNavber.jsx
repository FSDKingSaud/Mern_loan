import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { performLogout } from "../../../redux/reducers/adminAuthReducer";
import PropTypes from "prop-types";
import "./TopNavbar.css";
import LoanTopUpModal from "../dashboardcomponents/LoanTopUpModal";
import { io } from "socket.io-client";
import { addUnreadNotification } from "../../../redux/reducers/notificationReducer";

const socket = io(import.meta.env.VITE_BASE_URL);

const TopNavber = ({ title, user = "Femi Akinwade" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const logoutUserHandler = async () => {
    try {
      await dispatch(performLogout()); // Dispatch the thunk
      navigate("/login"); // Redirect after successful logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  // current login user
  const { user: currentUser } = useSelector((state) => state.adminAuth);
  const { unreadNotifications } = useSelector(
    (state) => state.notificationReducer
  );

  // check is qualify for topUp. true or false
  // top up loan update here
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    if (!currentUser?._id) return; // Ensure user ID exists before emitting

    socket.emit("join", currentUser._id);

    socket.on("newNotification", (data) => {
      dispatch(addUnreadNotification(data));
    });

    return () => {
      socket.off("newNotification"); // Correct event name
    };
  }, [currentUser, dispatch]);

  // handle open top up
  const handleOpenTopUp = () => {
    setShowTopUpModal(true);
  };

  const handleCloseTopUpModal = () => {
    setShowTopUpModal(false);
  };

  // notification animation
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Simulate a new notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewNotification(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div className="Inline mb-4">
        <div>
          <h4 id="Title">{title}</h4>
        </div>
        <div className="Inline Profile">
          {/* top up cta btn */}
          {currentUser?.topUpLoanEligibility?.isEligible && (
            <div>
              {currentUser?.userType === "staff" ||
              currentUser?.userType === "super_admin" ? null : (
                <div
                  className="Inline UserCard topup"
                  onClick={handleOpenTopUp}
                >
                  <p>Request Top-up Loan</p>
                </div>
              )}
            </div>
          )}

          <Link
            to="/dashboard/notifications"
            className={`notifyBox ${hasNewNotification ? "new" : ""}`}
          >
            <img src="/images/notificationicon.png" alt="alert" />
            {unreadNotifications ? (
              <p className="notify">{unreadNotifications.length}</p>
            ) : null}
          </Link>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="Inline Profile">
              <div className="Inline UserCard">
                <p>{user}</p>
                <img src="/images/smallavater.png" alt="user" />
              </div>
            </div>
            <button
              onClick={logoutUserHandler}
              className=""
              style={{
                backgroundColor: "#145098",
                marginRight: "10px",
                color: "white",
                fontSize: "23px",
                borderRadius: "5px",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "6px",
                paddingBottom: "6px",
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* loan top up modal */}
      <LoanTopUpModal
        showModal={showTopUpModal}
        handleCloseModal={handleCloseTopUpModal}
        customerID={currentUser?._id}
      />
    </>
  );
};

TopNavber.propTypes = {
  title: PropTypes.string,
  user: PropTypes.string,
};

export default TopNavber;

import { Outlet } from "react-router-dom";
import TopNavber from "../components/dashboard/topnavbar/TopNavber";
import SidebarMain from "../components/dashboard/SidebarMain";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import SidebarIcons from "../components/dashboard/SidebarIcons";
import { useOnClickOutside } from "../hooks/useOnClickOutside.";
import { useRef } from "react";

const CustomerLayout = ({
  onMenuItemClick,
  showSidebar,
  setShowSidebar,
  currentTitle,
}) => {
  // current login admin user
  const user = useSelector((state) => state.adminAuth.user);

  const userName = user?.firstname + " " + user?.lastname;

  const ref = useRef(null);

  const handleMouseOver = () => {
    setShowSidebar(true);
  };

  const handleMouseOut = () => {
    setShowSidebar(false);
  };

  useOnClickOutside(ref, () => setShowSidebar(false));

  return (
    <div className="DashboardContainer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-1 col-lg-2 SideNavContainer">
            {/* desktop navbar */}
            <div className="DesktopNav">
              <SidebarMain onMenuItemClick={onMenuItemClick} />
            </div>
            {/* mobile navbar */}
            <div className="MobileNav">
              {!showSidebar ? (
                <div className="SideNavIcon" onClick={handleMouseOver}>
                  <SidebarIcons />
                </div>
              ) : (
                <div
                  ref={ref}
                  className="SideNavMain"
                  onMouseLeave={handleMouseOut}
                >
                  <SidebarMain onMenuItemClick={onMenuItemClick} />
                </div>
              )}
            </div>
          </div>
          <div className="col-11 col-lg-10 ">
            <div className="TopNavber mr-3">
              <TopNavber title={currentTitle} user={userName} />
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CustomerLayout.propTypes = {
  onMenuItemClick: PropTypes.func,
  showSidebar: PropTypes.bool,
  setShowSidebar: PropTypes.func,
  currentTitle: PropTypes.string,
};

export default CustomerLayout;

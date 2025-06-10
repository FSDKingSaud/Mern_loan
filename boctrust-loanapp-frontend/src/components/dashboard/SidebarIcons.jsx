import "./Dashboard.css";

const SidebarIcons = () => {
  return (
    <div className="FixSideNav ">
      <div className="NavIcons .MobileNav">
        <div className="BLogo SBLogo">
          <img src="/images/dlogo.png" alt="boctrust-logo" />
        </div>

        <div className="IconBox">
          <img src="/images/ddashboard.png" alt="dashboard" />
        </div>

        <div className="IconBox">
          <img src="/images/dmyloan.png" alt="loan" />
        </div>

        <div className="IconBox">
          <img src="/images/dtransfer.png" alt="transfer" />
        </div>

        <div className="IconBox">
          <img src="/images/dwithdraw.png" alt="withdrawer" />
        </div>

        <div className="IconBox">
          <img src="/images/daccount.png" alt="account" />
        </div>

        <div className="IconBox">
          <img src="/images/dprofile.png" alt="profile" />
        </div>

        <div className="IconBox">
          <img src="/images/dreport.png" alt="report" />
        </div>
      </div>
    </div>
  );
};

export default SidebarIcons;

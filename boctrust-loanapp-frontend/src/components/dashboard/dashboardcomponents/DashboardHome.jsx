import { useSelector } from "react-redux";
import TopCardSec from "./TopCardSec";
import AccountOverviewTable from "./tables/AccountOverviewTable";
import RecentTransaction from "./tables/RecentTransaction";
import UpcomingLoanPayment from "./tables/UpcomingLoanPayment";
import "./DashboardHome.css"; 

const DashboardHome = () => {
  // get current login user
  const user = useSelector((state) => state.adminAuth.user);
 

  const isAccountCreated = user?.banking?.isAccountCreated;

  return (
    <div className={`DashboardHome ${!isAccountCreated ? "overlay" : ""}`}>
      <TopCardSec user={user} />
      <div className="PCont">
        <AccountOverviewTable user={user} />
        <UpcomingLoanPayment user={user} />
        <RecentTransaction user={user} />
      </div>
      {!isAccountCreated && (
        <div className="overlay-message">
          Your account is being processed. You would be contacted when it is
          activated
        </div>
      )}
    </div>
  );
};

export default DashboardHome;

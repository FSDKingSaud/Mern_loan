import { useRef, useState } from "react";
import AccountStatement from "./AccountStatement";
import ReportDetails from "./ReportDetails";

const Report = () => {
  const [accountStatement, setAccountStatement] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const printRef = useRef();

  return (
    <div>
      <AccountStatement
        isLoading={isLoading}
        setLoading={setLoading}
        accountStatement={accountStatement}
        printRef={printRef}
        setAccountStatement={setAccountStatement}
      />
      <ReportDetails printRef={printRef} isLoading={isLoading} accountStatement={accountStatement} />
    </div>
  );
};

export default Report;

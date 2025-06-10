import { useRef, useState } from "react";
import TransactionReportSection from "./TransactionReportSection";
import TransactionReportTop from "./TransactionReportTop";

const TransactionReport = () => {

  const [isLoading, setLoading] = useState(false);
  const printRef = useRef();

  return (
    <div className="SecCon">
      <TransactionReportTop
        isLoading={isLoading}
        setLoading={setLoading}
        printRef={printRef}
      />
      <TransactionReportSection
        printRef={printRef}
        isLoading={isLoading}
        
      />
    </div>
  );
};

export default TransactionReport;

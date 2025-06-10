import { Row, Col } from "react-bootstrap";
import Headline from "../../shared/Headline";
import LoanCard from "../LoanCard";
import "../Loan.css";

const BocTrustMsg = () => {
  return (
    <div className="container-fluid BocTrustMsg">
      <Row>
        <Col xs={12} md={6}>
          <LoanCard
            cname="DescriptionText"
            bgcolor="#fff"
            title={<Headline text="Who we are" />}
            description="BOCTRUST MICROFINANCE BANK is a financial institution licensed by Central Bank of Nigeria to gives social and economic Support to the lower middle class, working class and the economically active poor."
          />
        </Col>
        <Col xs={12} md={6}>
          <LoanCard
            cname="DescriptionText"
            bgcolor="#fff"
            title={<Headline text="Our Goal" />}
            description="Our core objective is to provide avenue for saving, access to credit and financial advisory services to individuals and micro, small & medium enterprises with competitive advantages. We believe in Growing Together with our customer."
          />
        </Col>
      </Row>
    </div>
  );
};

export default BocTrustMsg;

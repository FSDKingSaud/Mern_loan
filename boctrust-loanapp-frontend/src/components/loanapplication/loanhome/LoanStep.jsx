import { Row, Col } from "react-bootstrap";
import Headline from "../../shared/Headline";
import "../Loan.css";
import LoanCard from "../LoanCard";

const LoanStep = () => {
  return (
    <>
      <div className="container LoanStep">
        <Row>
          <Col xs={12} md={6}>
            <LoanCard
              title={
                <Headline
                  color="#fff"
                  text="Enter your information using the form above"
                />
              }
              description="Our loan application form will ask for every relevant information needed to complete your application online. This will include loan details, your personal information, employer information, and."
              imgsrc="/images/form1.png"
            />
          </Col>
          <Col xs={12} md={6}>
            <div className="CtaText">
              <p>Get your</p>
              <p>
                <span>money</span> today
              </p>
              <p>in 3</p>
              <p>
                <span>simple </span>steps
              </p>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <LoanCard
              title={
                <Headline
                  color="#fff"
                  text="Get your personal or business credit assessment result"
                />
              }
              description="In line with the Industry's best practices, our in-house team checks you application to know if you qualify for a loan. If you qualify, a message i sent to you conforming your application..."
              imgsrc="/images/form2.png"
            />
          </Col>
          <Col xs={12} md={6}>
            <LoanCard
              color="#fff"
              title={
                <Headline color="#fff" text="Wait for your money to arrive" />
              }
              description="Once application is approved, you would be contacted and your require loan would be disbursed to you. In addition to your loan, we also provide financial advisory services to help you better manage your finances."
              imgsrc="/images/form3.png"
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LoanStep;

import PropTypes from "prop-types"
import "./Overview.css";

const OurVisionMission = ({ mission, vision, goal}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="VisionLeft col-md-6 col-sm-12">
          <h3>Our Company Vision</h3>
          <p>
            {vision || "To be the Number 1 Microfinance Bank in terms of customer service, profitability and returns on investment."}
          </p>

          <h3>Our Company Mission</h3>
          <p>
            {mission || "We are committed to offering the highest level of professionalism and service with integrity to our partners and customers while ensuring profitable returns to our shareholders."}
          </p>

          <h3>Our Company Goal</h3>
          <p>
            {goal || "Our core objective is to provide avenue for saving, access to credit and financial advisory services to individuals and micro, small & medium enterprises with competitive advantages. We believe in Growing Together with our customer."}
          </p>
        </div>
        <div className="VisionRight col-md-6 col-sm-12">
          <img
            className="TopImg"
            src="/images/boctrust-staff1.avif"
            alt="bocstrust-microfinance-staff"
          />
        </div>
      </div>
    </div>
  );
};

OurVisionMission.propTypes = {
  mission: PropTypes.string,
  vision: PropTypes.string,
  goal: PropTypes.string
}

export default OurVisionMission;

import PropTypes from "prop-types"
import { useEffect } from "react";
// animation library
import AOS from "aos";
import "aos/dist/aos.css";
import "./Explore.css";

const ExploreBoctrust = ({content}) => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

  return (
    <div className="ExploreContainer">
      <div className="Explore">
        <h2>Explore Boctrust Mfb</h2>
        <p>
          {content?.exploreBoctrustText || "We are committed to delivering excellent services, which we constantly aim to improve upon as a means to achieving optimum customer satisfaction. We maintain confidentiality in all our dealings with our customers. Within our short time in the industry Boctrust Mfb has proven that we are a bank of now and the future."}
        </p>
      </div>
      <div className="row">
        <div className="col-sm-6 col-md-3 ExCard" data-aos="fade-right">
          <img src="/images/Vector.png" alt="safe-banking" />
          <h5>Safe & Secure</h5>
        </div>
        <div className="col-sm-6 col-md-3 ExCard" data-aos="fade-right">
          <img src="/images/online.png" alt="safe-banking" />
          <h5>Online Banking</h5>
        </div>
        <div className="col-sm-6 col-md-3 ExCard" data-aos="fade-right">
          <img src="/images/easy.png" alt="easy-access" />
          <h5>Easy to access</h5>
        </div>
        <div className="col-sm-6 col-md-3 ExCard" data-aos="fade-right">
          <img src="/images/banking.png" alt="interest-icon" />
          <h5>Affordable interest rates</h5>
        </div>
      </div>
    </div>
  );
};

ExploreBoctrust.propTypes = {
  content: PropTypes.shape({
    exploreBoctrustText: PropTypes.string
  })
}

export default ExploreBoctrust;

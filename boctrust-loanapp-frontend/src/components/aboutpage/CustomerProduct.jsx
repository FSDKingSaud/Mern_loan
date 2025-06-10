import PropTypes from "prop-types"
import Headline from "../shared/Headline";
import TopCard from "../shared/TopCard";

const CustomerProduct = ({paraText}) => {
  const styles = {
    container: {
      textAlign: "left",
      padding: "28px",
    },
    link: {
      color: "#145088",
        marginBottom: "8px",
      listStyleType: "square",
    },
  };
  return (
    <div className="container">
      <div className="row gx-2">
        <div className="col-md-6 col-sm-12">
          <TopCard
            className="overCard"
            spacer="0 18px 68px 68px"
            size={"1.3rem"}
            title={
              <Headline
                align="left"
                spacer="0 22px"
                text="Our customer receives"
              />
            }
            text={
              <div style={styles.container}>
                <p>Dedicated customer services on and offline</p>
                <ul>
                  <li style={styles.link}>Faster approvals</li>
                  <li style={styles.link}>24/7 Digital banking</li>
                  <li style={styles.link}>Lower interest rates</li>
                  <li style={styles.link}>Flexible repayment terms</li>

                  <li style={styles.link}>
                    Reliable and consistent processing
                  </li>
                  <li style={styles.link}>Secure and private transactions</li>
                </ul>
                <p>
                  Suffice it to say that we have carved a niche for ourselves in
                  the industry.
                </p>
              </div>
            }
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <TopCard
            className="overCard"
            spacer="0 68px 68px 18px"
            size={"1.3rem"}
            title={
              <Headline align="left" spacer="0 22px" text="Our Products" />
            }
            text={
              <div style={styles.container}>
                <p>
                  {paraText || "We have different classes of banking products designed to meet your personal and business needs. As a Bank for the economically active poor and young MSMEs, our products are most convenient, efficient and highly streamlined with high level of turnaround time to meet your immediate needs"}
                </p>
                <ul>
                  <li style={styles.link}>Investment</li>
                  <li style={styles.link}>Saving</li>
                  <li style={styles.link}>Loan</li>
                  <li style={styles.link}>Advisory</li>
                </ul>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

CustomerProduct.propTypes = {
  paraText: PropTypes.string
}

export default CustomerProduct;

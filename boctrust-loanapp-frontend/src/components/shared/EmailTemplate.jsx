import PropTypes from "prop-types"
const EmailTemplate = ({
  headline = "Boctrust Loan Application",
  salutation = "Dear",
  firstName = "Customer",
  content = "We are happy to inform you that your loan application was successful and it will be disbursed in 2 working days. In the meantime, check out our customer-first product. Click below:",
  buttonText = "Learn more",
  buttonLink = "https://boctrustmfb.com/",
  cta = "In the meantime, check out our customer-first product",
  closingRemarks = "Thank you for choosing Boctrust MFB Ltd",
}) => {
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      color: "#333",
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      margin: "20px",
      fontSize: "24px",
      fontWeight: "700",
    },
    content: {
      textAlign: "left",
      lineHeight: "1.6",
    },
    button: {
      display: "inline-block",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "5px",
      marginTop: "20px",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.container}>
      {/* brand logo */}
      <img
        src="https://boctrustmfb.com/images/boclogo.jpeg"
        alt="Boctrust MFB Ltd"
        style={{
          width: "100px",
          margin: "auto",
          display: "block",
          borderRadius: "5%",
        }}
      />
      <h1 style={styles.header}>{headline}</h1>
      <div style={styles.content}>
        <p>
          {salutation}, {firstName}. <br />
          {content}
        </p>
        <p>{cta}</p>
        <a
          href={buttonLink}
          style={{ ...styles.button, ...styles.buttonHover }}
        >
          {buttonText}
        </a>
      </div>
      <p style={{ ...styles.content, marginTop: "20px" }}>{closingRemarks}</p>
    </div>
  );
};

EmailTemplate.propTypes = {
  buttonLink: PropTypes.string,
  buttonText: PropTypes.string,
  closingRemarks: PropTypes.string,
  content: PropTypes.string,
  cta: PropTypes.string,
  firstName: PropTypes.string,
  headline: PropTypes.string,
  salutation: PropTypes.string
}

export default EmailTemplate;

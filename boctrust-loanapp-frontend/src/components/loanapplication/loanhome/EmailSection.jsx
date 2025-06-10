import PropTypes from "prop-types"
import Headline from "../../shared/Headline";


const EmailSection = ({handleBtn}) => {
    const styles = {
        container: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            placeContent: "center",
            minHeight: "725px",
            backgroundImage: "url(images/loanimage.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            marginBottom: "-98px",
        },
        emailcard: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "70%",
            height: "350px",
            padding: "38px",
            backgroundImage: "url(images/subcard.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "8px",
        },
        emailtext: {
            height: "50px",
            borderRadius: "25px",
            border: "none",
            padding: "0 28px",
            fontSize: "1.5rem",
            marginRight: "28px",

        },
        btn: {
            height: "50px",
            borderRadius: "25px",
            border: "none",
            padding: "0 28px",
            fontSize: "1.2rem",
            fontWeight: "700",
            backgroundColor: "#ecaa00",

        }
    };

  return (
    <div style={styles.container}>
      <div style={styles.emailcard} className="EmailCard">
        <Headline
          fontSize="2.2rem"
          color="#fff"
          spacer="28px 0 48px 0"
          text="Quick & easy loan for anyone!"
        />
        <div>
          <input style={styles.emailtext} type="email" placeholder="Enter your email address" />
          <button onClick={handleBtn} style={styles.btn}>Apply Now</button>
        </div>
      </div>
    </div>
  );
}

EmailSection.propTypes = {
  handleBtn: PropTypes.func
}

export default EmailSection
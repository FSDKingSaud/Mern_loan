import { useState, useEffect } from "react";
import sendEmail from "../../../utilities/sendEmail";
import EmailTemplate from "../shared/EmailTemplate";
import ReactDOMServer from "react-dom/server";
// animation library
import AOS from "aos";
import "aos/dist/aos.css";
import Headline from "../shared/Headline";
import Header from "../shared/Header";
import { Form, Button, Row, Col } from "react-bootstrap";

const Contact = () => {
  const styles = {
    map: {
      position: "relative",
      width: "100%",
      marginTop: "80px",
      padding: "38px",
      backgroundColor: "#ecaa00",
      overflow: "hidden",
    },
    form: {
      padding: "38px",
      backgroundColor: "#f5f5f5",
      borderRadius: "16px",
    },
    top: {
      marginTop: "-140px",
      backgroundColor: "#fff",
      borderRadius: "16px",
      paddingTop: "28px",
    },
  };

  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

  // contact form submission
  const [message, setMessage] = useState("");
  const [words, setWords] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle message word count
  const handleMessageChange = (e) => {
    const inputValue = e.target.value;

    // Check if the input exceeds the 300-word limit
    if (wordCount(inputValue) <= 150) {
      setFormData({
        ...formData,
        [e.target.name]: inputValue,
      });
    }
  };

  // Function to count words in a string
  const wordCount = (text) => {
    const words = text.trim().split(/\s+/);
    setWords(words.length);
    return words.length;
  };

  const clearField = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  // connect for submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_BASE_URL;

    const { fullName, phoneNumber, email, subject, message } = formData;
    const contact = {
      fullName,
      phoneNumber,
      email,
      subject,
      message,
    };

    const response = await fetch(`${apiUrl}/api/contact/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (response.ok) {
      // send form to email
      const emailTemplate = ReactDOMServer.renderToStaticMarkup(
        <EmailTemplate
          firstName="Boctrust Team"
          content={`
            Inquiry from: ${fullName}
            Phone Number: ${phoneNumber}
            Email: ${email}
            Topic: ${subject}
            
            Message: ${message}.`}
        />
      );

      const option = {
        email: "enquiries@boctrustmfb.com",
        subject: "Customer Inquiry from Boctrust MFB",
        html: emailTemplate,
      };

      sendEmail(option);
    }

    clearField();
    // set notification messgae
    setMessage("Message sent successfully");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <>
      <Header imgurl="/images/boccontact.png" />
      <div className="container-fluid">
        <div className="container" style={styles.top}>
          <Headline
            spacer="38px 0 18px 0"
            text="Contact Us For Your Financial Needs"
          />

          <div className="row" style={styles.form}>
            <div
              className="col-md-6 col-sm-12"
              style={{ backgroundColor: "#fff" }}
              data-aos="fade-up"
            >
              <Headline
                spacer="62px 0 0 0"
                align="left"
                text="We're here to help!"
              />
              <hr style={{ marginBottom: "28px" }} />
              <Headline align="left" text="Call Us" />
              <h4> 08177773196, 08076710000</h4>
              <h5> 9am - 5pm, Monday - Friday</h5>

              <Headline align="left" text="Email Us" />
              <h5>
                <a href="mailto:enquiries@boctrustmfb.com">
                  enquiries@boctrustmfb.com
                </a>
              </h5>

              <Headline align="left" text="Visit Us @" />
              <h5> 1st floor, 26 Moloney street, Onikan Lagos.</h5>
            </div>

            {/* contact form */}
            <div
              className="col-md-6 col-sm-12"
              style={styles.form}
              data-aos="fade-up"
            >
              <Headline align="left" text="Send us a message" />
              <hr style={{ marginBottom: "28px" }} />
              <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Group className="mb-3">
                  <Row>
                    <Col>
                      <Form.Control
                        onChange={handleChange}
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        placeholder="Full Name"
                        required
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        onChange={handleChange}
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        placeholder="Phone Number"
                        required
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    onChange={handleChange}
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="Email Address"
                    required
                  />
                  <Form.Text className="text-muted">
                    We&apos;ll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    onChange={handleChange}
                    name="subject"
                    type="text"
                    value={formData.subject}
                    placeholder="Subject"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Comment or Message</Form.Label>
                  <Form.Control
                    onChange={handleMessageChange}
                    name="message"
                    value={formData.message}
                    as="textarea"
                    rows={6}
                    placeholder="Type here"
                    required
                  />
                  <p style={{ fontSize: "12px", padding: "6px" }}>
                    Words {words} of 150
                  </p>
                </Form.Group>

                <Button
                  style={{
                    backgroundColor: "#145088",
                    border: "none",
                  }}
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
              <p style={{ textAlign: "center", color: "#094379" }}>{message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* bottom section contact map*/}
      <div style={styles.map} data-aos="fade-up">
        <iframe
          width="100%"
          height="600"
          src="https://maps.google.com/maps?width=700&amp;height=440&amp;hl=en&amp;q=1st%20floor%2C%2026%20Moloney%20street%2C%20Onikan%20Lagos.+(Boctrust%20Microfinance%20Bank)&amp;ie=UTF8&amp;t=&amp;z=17&amp;iwloc=B&amp;output=embed"
        ></iframe>
      </div>
    </>
  );
};

export default Contact;

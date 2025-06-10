/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWikis } from "../../redux/reducers/wikiReducer";
// animation library
import AOS from "aos";
import "aos/dist/aos.css";
import data from "../../mockdatabase/faqs.json";
import { Accordion, Button, Form } from "react-bootstrap";
import Header from "../shared/Header";
import Headline from "../shared/Headline";
import SearchBox from "../shared/SearchBox";
import "./Support.css";
import Divider from "./Divider";
import TermsPolicy from "./TermsPolicy";
import PageLoader from "../dashboard/shared/PageLoader";
import apiClient from "../../lib/axios";

const Support = () => {
  // fetch faqs from redux store
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchWikis());
  }, [dispatch]);

  const wikis = useSelector((state) => state.wikiReducer.wikis.wikis);
  const status = useSelector((state) => state.wikiReducer.status);

  // wiki local state
  const [wikisList, setWikisList] = useState(data.faqs);
  const [isLoading, setIsLoading] = useState(false);

  // check if wikis is not empty and update wikisList
  useEffect(() => {
    if (wikis) {
      setWikisList(wikis);
    }
  }, [wikis]);

  // inquiry form state
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [message, setMessage] = useState("");

  // handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // clear form fields
  const clearForm = () => {
    setFormData({
      email: "",
      subject: "",
      message: "",
    });
  };

  // handle form submit
  const handleFormSubmit = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      const apiUrl = import.meta.env.VITE_BASE_URL;

      const { email, subject, message } = formData;
      const inquiry = {
        email,
        subject,
        message,
      };

      await apiClient.post(`/inquiry/inquiries`, inquiry);

      clearForm();
      setMessage("Inquiry sent successfully");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      coonsole.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      padding: "1rem",
      backgroundColor: "#145088",
    },
  };

  const faqs = wikisList;

  const currentFaqs = faqs.filter(
    (faq) => faq.category.toLowerCase() === "deposit"
  );
  // component state
  const [firstFaqs, setFirstFaqs] = useState(currentFaqs);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  //    create object of faqs, key is category and value is array of object question and answer
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(faqsByCategory);

  // handle faq data change on category btn click
  const handleFaqChange = (category) => {
    setShowForm(false);
    const currentFaqs = faqsByCategory[category];
    setFirstFaqs(currentFaqs);
    // add active class to the clicked btn
    const btns = document.querySelectorAll(".CategoryBtn");
    btns.forEach((btn) => {
      btn.classList.remove("ActiveCategory");
    });
    const currentBtn = document.querySelector(`#${category}`);
    currentBtn.classList.add("ActiveCategory");
  };

  // open inquiry form
  const handleOpenFormBtn = () => {
    // toggle showForm
    setShowForm(!showForm);
  };

  // handle search term change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const currentFaqs = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFirstFaqs(currentFaqs);
  };

  return (
    <>
      <Header imgurl="/images/bocsupport.png" />
      <div className="container-fluid" style={styles.container}>
        <SearchBox
          headlineTxt="How can we help you today?"
          func={handleSearch}
        />
      </div>

      <div className="container-fluid" style={styles.container}>
        {/* knowledge base section */}
        <div className=" KnowledgeBase">
          <Headline color="#fff" align="left" text="Knowledge Base" />

          {/* wiki categories list */}
          <div className="row">
            {categories.map((category) => (
              <div className="col-md-2 col-sm-4 my-1" key={category}>
                <button
                  onClick={() => handleFaqChange(category)}
                  className="btn btn-outline-light CategoryBtn"
                  id={category}
                >
                  {category.toUpperCase()}
                </button>
              </div>
            ))}

            <div className="col-md-2 col-sm-4 my-1">
              <Button variant="outline-warning" onClick={handleOpenFormBtn}>
                Send as Inquiry
              </Button>
            </div>
          </div>

          <Divider />
          {/* faqs */}
          {firstFaqs.length === 0 || showForm ? (
            <div className="NoResult">
              <h3 className="text-center">No results found</h3>
              <p>
                Fill the form below and our customer support team will get back
                to you within 48 hours
              </p>

              {/* inquiry form */}
              <div className="InquiryForm">
                <h4>Inquiry Form</h4>
                <Form onSubmit={(e) => handleFormSubmit(e)}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange(e)}
                      placeholder="Enter email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicSubject">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => handleFormChange(e)}
                      placeholder="Enter subject"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicMessage">
                    <Form.Label>Message/Inquiry</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={(e) => handleFormChange(e)}
                      rows={8}
                      placeholder="Enter message or inquiry"
                      required
                    />
                  </Form.Group>

                  <Button disabled={isLoading} variant="primary" className="d-flex" type="submit">
                    Submit {isLoading && <PageLoader width="18px" />}
                  </Button>
                </Form>
                <p style={{ textAlign: "center" }}>{message}</p>
              </div>
            </div>
          ) : (
            <div>
              {status === "loading" && <PageLoader />}
              {firstFaqs.map(({ id, question, answer }) => (
                <Accordion key={id} defaultActiveKey="0" flush>
                  <Accordion.Item
                    eventKey={id}
                    className="AccordionItem"
                    data-aos="fade-up"
                  >
                    <Accordion.Header>{question}</Accordion.Header>
                    <Accordion.Body>{answer}</Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </div>
          )}
        </div>
        {/* end of knowledge base section */}
      </div>

      {/* terms and policy section */}
      <div data-aos="fade-up">
        <TermsPolicy />
      </div>
    </>
  );
};

export default Support;

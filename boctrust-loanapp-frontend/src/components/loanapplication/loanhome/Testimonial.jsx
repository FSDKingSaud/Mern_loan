import {useState} from "react";
import { Row, Col } from "react-bootstrap";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import Headline from "../../shared/Headline";
import TestimonialCard from "./TestimonialCard";
import "../Loan.css";
import testimonials from "../../../mockdatabase/testimonials.json";

const Testimonial = () => {
  const styles = {
    container: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "48px 128px",
      backgroundColor: "#ecaa00",
    },
    nextPrev: {
      marginTop: "48px",
    },
    btn: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "#fff",
      fontSize: "2rem",
      marginRight: "28px",
      cursor: "pointer",
    },
  };
  // handler testimonial data
  // render 3 testimonial cards and another 3 testimonial cards on click of next button and prev button respectively
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => { 
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 < testimonials.length ? prevIndex + 3 : prevIndex
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 >= 0 ? prevIndex - 3 : prevIndex
    );
  }

  return (
    <div className="container-fluid Testimonial" style={styles.container}>
      <Headline
        fontSize="2rem"
        color="#fff"
        spacer="28px 0 48px 0"
        text="What our customers say about us"
      />

      <Row>
        {testimonials
          .slice(currentIndex, currentIndex + 3)
          .map((testimonial) => (
            <Col
              xs={12}
              md="4"
              key={testimonial.id}
              
            >
              <TestimonialCard
                img={testimonial.image}
                name={testimonial.name}
                text={testimonial.text.slice(0, 140) + "....."}
                career={testimonial.career}
              />
            </Col>
          ))}
      </Row>

      {/* next and prev button */}
      <div style={styles.nextPrev}>
        <button onClick={handlePrev} className="NextPrevBtn">
          <GrLinkPrevious />
        </button>
        <button onClick={handleNext} className="NextPrevBtn">
          <GrLinkNext />
        </button>
      </div>
    </div>
  );
}

export default Testimonial
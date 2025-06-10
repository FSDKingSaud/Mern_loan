import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../../../../redux/reducers/siteContentReducer";
import PageLoader from "../../shared/PageLoader";
import "./Editor.css";
import apiClient from "../../../../lib/axios";

const HomeEditor = () => {
  const dispatch = useDispatch();
  const siteContent = useSelector((state) => state.siteContent.siteContent);

  // Local state to manage form data
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  useEffect(() => {
    if (siteContent) {
      setFormData(siteContent);
    }
  }, [siteContent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...formData.homeCardText];
    newCards[index] = { ...newCards[index], [field]: value };
    setFormData({ ...formData, homeCardText: newCards });
  };

  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
 
    try {
      // console.log("formData", formData);
      // Update the content in the database
      const response = await apiClient.put(
        `/site-content/update-content`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await response.json();
      if (data) {
        setMessage("Content updated successfully");
        setLoading(false);

        // setMessage to " " after 3 seconds
        setTimeout(() => {
          setMessage(" ");
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      setMessage("An error occurred. Please try again");

      // setMessage to " " after 3 seconds
      setTimeout(() => {
        setMessage(" ");
      }, 3000);

      throw new Error(error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <div>
          <label htmlFor="exploreBoctrustText" className="title">
            Explore Boctrust Text
          </label>
          <textarea
            id="exploreBoctrustText"
            name="exploreBoctrustText"
            value={formData.exploreBoctrustText || ""}
            onChange={handleChange}
            rows="4"
            className="inputBox"
          />
        </div>

        <div>
          <label htmlFor="companyOverviewText" className="title">
            Company Overview Text
          </label>
          <textarea
            id="companyOverviewText"
            name="companyOverviewText"
            value={formData.companyOverviewText || ""}
            onChange={handleChange}
            rows="4"
            className="inputBox"
          />
        </div>

        <div>
          <label htmlFor="visionStatement" className="title">
            Vision Statement
          </label>
          <textarea
            id="visionStatement"
            name="visionStatement"
            value={formData.visionStatement || ""}
            onChange={handleChange}
            rows="2"
            className="inputBox"
          />
        </div>

        <div>
          <label htmlFor="missionStatement" className="title">
            Mission Statement
          </label>
          <textarea
            id="missionStatement"
            name="missionStatement"
            value={formData.missionStatement || ""}
            onChange={handleChange}
            rows="2"
            className="inputBox"
          />
        </div>

        <div>
          <label htmlFor="whoWeAreHomeText" className="title">
            Who We Are Text
          </label>
          <textarea
            id="whoWeAreHomeText"
            name="whoWeAreHomeText"
            value={formData.whoWeAreHomeText || ""}
            onChange={handleChange}
            rows="4"
            className="inputBox"
          />
        </div>

        <div>
          <label htmlFor="companyGoal" className="title">
            Company Goal
          </label>
          <textarea
            id="companyGoal"
            name="companyGoal"
            value={formData.companyGoal || ""}
            onChange={handleChange}
            rows="4"
            className="inputBox"
          />
        </div>

        <hr className="divider" />
        <div>
          <label htmlFor="ourPeoplePara1" className="title">
            Our People Paragraph 1
          </label>
          <textarea
            id="ourPeoplePara1"
            name="ourPeoplePara1"
            value={formData.ourPeoplePara1 || ""}
            onChange={handleChange}
            rows="3"
            className="inputBox"
          />
        </div>

        <div>
          <label htmlFor="ourPeoplePara2" className="title">
            Our People Paragraph 2
          </label>
          <textarea
            id="ourPeoplePara2"
            name="ourPeoplePara2"
            value={formData.ourPeoplePara2 || ""}
            onChange={handleChange}
            rows="3"
            className="inputBox"
          />
        </div>

        <div>
          <label htmlFor="ourPeoplePara3" className="title">
            Our People Paragraph 3
          </label>
          <textarea
            id="ourPeoplePara3"
            name="ourPeoplePara3"
            value={formData.ourPeoplePara3 || ""}
            onChange={handleChange}
            rows="3"
            className="inputBox"
          />
        </div>

        <hr className="divider" />
        {formData.homeCardText?.map((card, index) => (
          <div key={card._id} style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
              Home Card {index + 1}
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ marginBottom: "10px" }}>
                <label
                  htmlFor={`homeCardTitle${index}`}
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Title
                </label>
                <input
                  id={`homeCardTitle${index}`}
                  value={card.title || ""}
                  onChange={(e) =>
                    handleCardChange(index, "title", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor={`homeCardText${index}`}
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Text
                </label>
                <textarea
                  id={`homeCardText${index}`}
                  value={card.text || ""}
                  onChange={(e) =>
                    handleCardChange(index, "text", e.target.value)
                  }
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <hr className="divider" />
        <div>
          <p style={{ textAlign: "center" }}>{message}</p>
        </div>

        {loading && <PageLoader width="50px" />}
        <button
          type="submit"
          style={{ padding: "10px 20px", marginTop: "20px" }}
          className="submitBtn"
        >
          Update Home Page Content
        </button>
      </form>
    </div>
  );
};

export default HomeEditor;

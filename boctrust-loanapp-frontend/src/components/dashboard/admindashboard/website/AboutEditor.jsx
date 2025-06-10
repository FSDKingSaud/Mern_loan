import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../../../../redux/reducers/siteContentReducer";
import PageLoader from "../../shared/PageLoader";
import "./Editor.css";
import apiClient from "../../../../lib/axios";

const AboutEditor = () => {
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

  const handleOurValueChange = (index, field, value) => {
    const newValues = [...formData.ourValue];
    newValues[index] = { ...newValues[index], [field]: value };
    setFormData({ ...formData, ourValue: newValues });
  };

  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    try {
      // console.log("formData", formData);
      // Update the content in the database
      const { data } = await apiClient.put(
        `/site-content/update-content`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
     
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

        <div>
          <label htmlFor="ourPeopleAboutText" className="title">
            Our People About Page Text
          </label>
          <textarea
            id="ourPeopleAboutText"
            name="ourPeopleAboutText"
            value={formData.ourPeopleAboutText || ""}
            onChange={handleChange}
            rows="3"
            className="inputBox"
          />
        </div>

        <div>
          <label htmlFor="ourProductText" className="title">
            Our Product Text
          </label>
          <textarea
            id="ourProductText"
            name="ourProductText"
            value={formData.ourProductText || ""}
            onChange={handleChange}
            rows="3"
            className="inputBox"
          />
        </div>

        <hr className="divider" />
        {formData.ourValue?.map((value, index) => (
          <div key={value._id} style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
              Our Value {index + 1}
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ marginBottom: "10px" }}>
                <label
                  htmlFor={`ourValueTitle${index}`}
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Title
                </label>
                <input
                  id={`ourValueTitle${index}`}
                  value={value.title || ""}
                  onChange={(e) =>
                    handleOurValueChange(index, "title", e.target.value)
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
                  htmlFor={`ourValueDescription${index}`}
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Description
                </label>
                <textarea
                  id={`ourValueDescription${index}`}
                  value={value.description || ""}
                  onChange={(e) =>
                    handleOurValueChange(index, "description", e.target.value)
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
          Update About Page Content
        </button>
      </form>
    </div>
  );
};

export default AboutEditor;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDirectors } from "../../../../redux/reducers/boardDirectorReducer";
import PageLoader from "../../shared/PageLoader";
import apiClient from "../../../../lib/axios";

const BoardOfDirectorEditor = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const directors = useSelector((state) => state.directors.directors);
  const [formData, setFormData] = useState([]);
  const [newDirector, setNewDirector] = useState({
    name: "",
    title: "",
    profileImg: "",
    biography: [],
  });
  const [currentDirectorIndex, setCurrentDirectorIndex] = useState(0);
  const [openAddDirector, setOpenAddDirector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchDirectors());
  }, [dispatch]);

  useEffect(() => {
    setFormData(directors);
  }, [directors]);

  const handleChange = (field, value) => {
    setFormData((prevFormData) => {
      const updatedDirectors = prevFormData.map((director, i) =>
        i === currentDirectorIndex ? { ...director, [field]: value } : director
      );
      return updatedDirectors;
    });
  };

  const handleBiographyChange = (bioIndex, value) => {
    setFormData((prevFormData) => {
      const updatedBiography = [
        ...prevFormData[currentDirectorIndex].biography,
      ];
      updatedBiography[bioIndex] = value;

      const updatedDirectors = prevFormData.map((director, i) =>
        i === currentDirectorIndex
          ? { ...director, biography: updatedBiography }
          : director
      );

      return updatedDirectors;
    });
  };

  const resetMessage = () => {
    // setMessage to " " after 5 seconds
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  // handle director update
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      for (const director of formData) {
        const { _id, ...updatedData } = director; // Assuming each director has a unique identifier (_id)

        // Send update request to the backend
        await apiClient.put(`/board-member/edit-member/${_id}`, updatedData);
      }
      setLoading(false);
      dispatch(fetchDirectors()); // Refresh list of directors
      setMessage("Directors updated successfully!");

      // setMessage to " " after 5 seconds
      resetMessage();
    } catch (error) {
      setLoading(false);
      setMessage("Failed to update directors. Please try again.");

      // setMessage to " " after 5 seconds
      resetMessage();
      throw new Error(error);
    }
  };

  const handleAddDirector = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      // Send add request to the backend
      await apiClient.post(`/board-member/add-member`, newDirector);

      // Refresh list of directors
      dispatch(fetchDirectors());
      setMessage("New director added successfully!");

      // setMessage to " " after 5 seconds
      resetMessage();

      setLoading(false);

      // Reset newDirector state
      setNewDirector({
        name: "",
        title: "",
        profileImg: "",
        biography: [],
      });
    } catch (error) {
      setLoading(false);
      setMessage("Failed to add new director. Please try again.");

      // setMessage to " " after 5 seconds
      resetMessage();
      throw new Error(error);
    }
  };

  const handleOpenAddDirector = () => {
    // toggle openAddDirector state
    setOpenAddDirector((prev) => !prev);
  };

  const handlePrevious = () => {
    if (currentDirectorIndex > 0) {
      setCurrentDirectorIndex(currentDirectorIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentDirectorIndex < formData.length - 1) {
      setCurrentDirectorIndex(currentDirectorIndex + 1);
    }
  };

  // Handle deleting a director
  const handleDeleteDirector = async (directorId) => {
    try {
      await apiClient.delete(`/board-member/delete/${directorId}`);

      dispatch(fetchDirectors());
      
      // set director to the previous one if the current director is the last one
      if (currentDirectorIndex === formData.length - 1) {
        setCurrentDirectorIndex(currentDirectorIndex - 1);
      }

      setMessage("Director deleted successfully!");
      resetMessage();
    } catch (error) {
      setMessage("Failed to delete director. Please try again.");
      resetMessage();
      throw new Error(error);
    }
  };

  const currentDirector = formData[currentDirectorIndex];

  return (
    <>
      {!openAddDirector ? (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <button
            className="btn btn-primary"
            onClick={handleOpenAddDirector}
            style={{ marginBottom: "20px" }}
          >
            Add New Director
          </button>
          {currentDirector && (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                  Director {currentDirectorIndex + 1}
                </h3>
                <div style={{ marginBottom: "10px" }}>
                  <label
                    htmlFor={`name`}
                    style={{ display: "block", marginBottom: "5px" }}
                  >
                    Name
                  </label>
                  <input
                    id={`name`}
                    value={currentDirector.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label
                    htmlFor={`title`}
                    style={{ display: "block", marginBottom: "5px" }}
                  >
                    Title
                  </label>
                  <input
                    id={`title`}
                    value={currentDirector.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label
                    htmlFor={`profileImg`}
                    style={{ display: "block", marginBottom: "5px" }}
                  >
                    Profile Image URL
                  </label>
                  <input
                    id={`profileImg`}
                    value={currentDirector.profileImg}
                    onChange={(e) => handleChange("profileImg", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                {currentDirector.biography.map((bio, bioIndex) => (
                  <div key={bioIndex} style={{ marginBottom: "10px" }}>
                    <label
                      htmlFor={`biography${bioIndex}`}
                      style={{ display: "block", marginBottom: "5px" }}
                    >
                      Biography Paragraph {bioIndex + 1}
                    </label>
                    <textarea
                      id={`biography${bioIndex}`}
                      value={bio}
                      onChange={(e) =>
                        handleBiographyChange(bioIndex, e.target.value)
                      }
                      rows="5"
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                ))}
              </div>
              {loading && <PageLoader width="50px" />}
              {message && <p style={{ color: "#eeaa00" }}>{message}</p>}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentDirectorIndex === 0}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor:
                      currentDirectorIndex === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentDirectorIndex === formData.length - 1}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor:
                      currentDirectorIndex === formData.length - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Next
                </button>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Update Directors
              </button>
              <button
                type="button"
                onClick={() => handleDeleteDirector(currentDirector._id)}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#DC3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Delete Director
              </button>
            </form>
          )}
        </div>
      ) : (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <button
            className="btn btn-primary"
            onClick={handleOpenAddDirector}
            style={{ marginBottom: "20px" }}
          >
            Cancel Add Director
          </button>
          <h2 style={{ textAlign: "center", marginTop: "40px" }}>
            Add New Director
          </h2>
          <form
            onSubmit={handleAddDirector}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor="newName"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Name
              </label>
              <input
                id="newName"
                value={newDirector.name}
                onChange={(e) =>
                  setNewDirector({ ...newDirector, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor="newTitle"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Title
              </label>
              <input
                id="newTitle"
                value={newDirector.title}
                onChange={(e) =>
                  setNewDirector({ ...newDirector, title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor="newProfileImg"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Profile Image URL
              </label>
              <input
                id="newProfileImg"
                value={newDirector.profileImg}
                onChange={(e) =>
                  setNewDirector({ ...newDirector, profileImg: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor="newBiography"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Biography
              </label>
              <textarea
                id="newBiography"
                value={newDirector.biography.join("\n")}
                onChange={(e) =>
                  setNewDirector({
                    ...newDirector,
                    biography: e.target.value.split("\n"),
                  })
                }
                rows="5"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {loading && <PageLoader width="50px" />}
            {message && <p style={{ color: "#eeaa00" }}>{message}</p>}
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#eeaa00",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Add Director
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default BoardOfDirectorEditor;

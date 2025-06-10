/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchWikis } from "../../../../redux/reducers/wikiReducer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import apiClient from "../../../../lib/axios";

const EditWiki = (props) => {
  const dispatch = useDispatch();
  const wikis = props.wikis;

  // form state
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // pass object data to form
  const updateFormObject = () => {
    setEditQuestion(wikis.question);
    setEditAnswer(wikis.answer);
    setEditCategory(wikis.category);
  };

  useEffect(() => {
    updateFormObject();
  }, [wikis]);

  // clear form fields
  const clearForm = () => {
    setEditQuestion("");
    setEditAnswer("");
    setEditCategory("");
    dispatch(fetchWikis());
  };

  // close model box
  const handleClose = () => {
    props.onHide();
    clearForm();
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedWikis = {
      question: editQuestion,
      answer: editAnswer,
      category: editCategory,
    };

    await apiClient(`/wiki/wikis/${wikis._id}`, updatedWikis);

    clearForm();
    handleClose();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Wiki/Support
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <form onSubmit={handleSubmit}>
          <div className="FieldGroup">
            <label htmlFor="question" style={{ marginTop: "-1rem" }}>
              Question
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="answer" style={{ marginTop: "-1rem" }}>
              Answer
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="category" style={{ marginTop: "-1rem" }}>
              Category
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="button" onClick={handleSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditWiki;

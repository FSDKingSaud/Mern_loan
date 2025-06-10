/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchBlogPosts } from "../../../../redux/reducers/blogReducer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiClient from "../../../../lib/axios";

const EditBlogPage = (props) => {
  const dispatch = useDispatch();
  const post = props.blog;

  const [editTitle, setEditTitle] = useState("");
  const [editPostSummary, setEditPostSummary] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTags, setEditTags] = useState("");

  // pass object data to form
  const updateFormObject = () => {
    setEditTitle(post.title);
    setEditPostSummary(post.postSummary);
    setEditBody(post.body);
    setEditCategory(post.category);
    setEditTags(post.tags);
  };

  useEffect(() => {
    updateFormObject();
  }, [post]);

  // clear form fields
  const clearForm = () => {
    setEditTitle("");
    setEditPostSummary("");
    setEditBody("");
    setEditCategory("");
    setEditTags("");
    dispatch(fetchBlogPosts());
  };

  // close model box
  const handleClose = () => {
    props.onHide();
    clearForm();
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const updatedPost = {
      title: editTitle,
      postSummary: editPostSummary,
      body: editBody,
      category: editCategory,
      tags: editTags,
    };

    await apiClient.put(`/blog/posts/${post._id}`, updatedPost);

    clearForm();
    handleClose();
  };

  // Editor module
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  // Editor formats
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
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
          Edit Blog Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <form onSubmit={handleSubmit}>
          <div className="FieldGroup">
            <label htmlFor="title" style={{ marginTop: "-1rem" }}>
              Title
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
          <div className="FieldGroup">
            <label htmlFor="title" style={{ marginTop: "-1rem" }}>
              Post Summary
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editPostSummary}
              onChange={(e) => setEditPostSummary(e.target.value)}
            />
          </div>
          <div className="FieldGroup">
            <label htmlFor="title" style={{ marginTop: "-1rem" }}>
              Post Tags
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
            />
          </div>
          <div className="FieldGroup">
            <label htmlFor="title" style={{ marginTop: "-1rem" }}>
              Post Category
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />
          </div>
          <div style={{ margin: "-2rem 1rem 1rem 1rem" }}>
            <label htmlFor="category">Post Content</label>
            <ReactQuill
              theme={"snow"}
              modules={modules}
              formats={formats}
              bounds={".app"}
              value={editBody}
              onChange={(e) => setEditBody(e)}
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

export default EditBlogPage;

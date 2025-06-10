import { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import apiClient from "../../../../lib/axios";
// import BocEditor from "../../shared/BocEditor";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  postSummary: Yup.string().required("Post summary is required"),
  body: Yup.string().required("Blog content is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.string().required("Tags is required"),
  postImg: Yup.string().required("Post image is required"),
});

const initialValues = {
  title: "",
  postSummary: "",
  body: "",
  category: "",
  tags: "",
  postImg: "",
};

const categories = [
  { value: "personal finance", label: "Personal Finance" },
  { value: "sme advisory", label: "SME Advisory" },
  { value: "other", label: "Other" },
  // Add more options as needed
];

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

const AddNewBlog = ({ func }) => {
  const [notification, setNotification] = useState("");
  // handle new form submit
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {

    // convert tags to array
    const tags = values.tags.split(",");

    // Handle form submission logic here
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("postSummary", values.postSummary);
    formData.append("body", values.body);
    formData.append("category", values.category);
    formData.append("tags", tags);
    formData.append("postImg", values.postImg);

    await apiClient.post(`/blog/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setNotification("Blog post added successfully");

    // set notification to disappear after 5 seconds
    setTimeout(() => {
      setNotification("");
    }, 5000);

    setSubmitting(false);

    resetForm(initialValues);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleCancel = () => {
    func(false);
  };

  return (
    <div>
      <div className="TransContainer">
        <DashboardHeadline>Add New Blog Post</DashboardHeadline>

        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.title}
              />
              {formik.errors.title && formik.touched.title ? (
                <div className="Error">{formik.errors.title}</div>
              ) : null}
            </div>

            <div className="FieldGroup">
              <label htmlFor="postSummary">Post Summary</label>
              <input
                type="text"
                name="postSummary"
                id="postSummary"
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.postSummary}
              />
              {formik.errors.postSummary && formik.touched.postSummary ? (
                <div className="Error">{formik.errors.postSummary}</div>
              ) : null}
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup IUpload">
              <label htmlFor="postImg">Featured Image</label>
              <input
                type="file"
                name="postImg"
                id="postImg"
                className="Input"
                onChange={(event) => {
                  formik.setFieldValue("postImg", event.currentTarget.files[0]);
                }}
                accept="image/*"
                style={{ paddingBottom: "38px", fontSize: "12px" }}
              />
              {formik.errors.postImg && formik.touched.postImg ? (
                <div className="Error">{formik.errors.postImg}</div>
              ) : null}
            </div>

            <div className="FieldGroup">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="Separate tags with comma"
                id="tags"
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.tags}
              />
              {formik.errors.tags && formik.touched.tags ? (
                <div className="Error">{formik.errors.tags}</div>
              ) : null}
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="category">Category</label>
              <select
                onChange={formik.handleChange}
                value={formik.values.category}
                name="category"
                id="category"
                className="Select"
              >
                <option value="" label="Select a category" />
                {categories.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </select>
              {formik.errors.category && formik.touched.category ? (
                <div className="Error">{formik.errors.category}</div>
              ) : null}
            </div>
          </div>

          <div className="Editor">
            <label htmlFor="category">Post Content</label>
            <ReactQuill
              theme={"snow"}
              modules={modules}
              formats={formats}
              bounds={".app"}
              placeholder="Add rich post content here"
              onChange={(event) => {
                formik.setFieldValue("body", event);
              }}
              value={formik.values.body}
            />
          </div>
          <div className="Notification">
            <p>{notification}</p>
          </div>
          <div className="BtnContainer">
            <BocButton
              fontSize="1.6rem"
              type="submit"
              bgcolor="#ecaa00"
              bradius="18px"
              width="220px"
              margin="1rem 0"
            >
              Add Post
            </BocButton>
            <BocButton
              fontSize="1.6rem"
              type="button"
              bgcolor="gray"
              bradius="18px"
              width="220px"
              margin="1rem 0"
              func={handleCancel}
            >
              Cancel
            </BocButton>
          </div>
        </form>
      </div>
    </div>
  );
};

AddNewBlog.propTypes = {
  func: PropTypes.func,
};

export default AddNewBlog;

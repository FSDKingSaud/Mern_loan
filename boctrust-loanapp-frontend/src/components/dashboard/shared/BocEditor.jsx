// import { useState } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BocEditor = ({
  placeholder = "Add rich content here",
  func,
  editorValue,
}) => {
//   const [editorHtml, setEditorHtml] = useState("");

//   const handleChange = (html) => {
//     setEditorHtml(html);
//   };

  return (
    <div>
      <ReactQuill
        theme={"snow"}
        onChange={func}
        value={editorValue}
        modules={BocEditor.modules}
        formats={BocEditor.formats}
        bounds={".app"}
        placeholder={placeholder}
      />
    </div>
  );
};

/* Quill modules to attach to editor */
BocEditor.modules = {
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

/* Quill editor formats */
BocEditor.formats = [
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

/* PropType validation */
BocEditor.propTypes = {
  placeholder: PropTypes.string,
  func: PropTypes.func,
  editorValue: PropTypes.string,
};

export default BocEditor;

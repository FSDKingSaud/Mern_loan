/* eslint-disable react/prop-types */
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./CreateNewAdmin.css";
import { userTypes } from "../../../../lib/userRelated";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";
import { updateUserValidationSchema } from "../../../loanapplication/loanform/formvalidation";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { fetchAdmins } from "../../../../redux/reducers/adminUserReducer";
import apiClient from "../../../../lib/axios";

const EditUser = (props) => {
  const user = props.userobj;

  const viewEdit = props.viewEdit;

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // close model box
  const handleClose = (clearForm) => {
    props.onHide();
    clearForm();
  };

  // submit update to api endpoint
  const handleSubmitForm = async (values, resetForm) => {
    try {
      setIsLoading(true);

     
      const updatedUser = {
        fullName: values["editFullName"],
        email: values["editEmail"],
        phone: values["editPhone"],
        username: values["editUsername"],
        password: values["editPassword"],
        userType: values["editUserType"],
        userRole: values["editAdminRoles"],
      };

      const res = await apiClient.put(`/admin/update/${user._id}`, updatedUser);

      if (res.status == 200) {
        dispatch(fetchAdmins());
        handleClose(resetForm);
        toast.success("User has been updated");
      } else {
        const errorResponse = await res.json();
        toast.error(errorResponse?.error || "Something Went Wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    values,
    resetForm,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      editFullName: user.fullName,
      editEmail: user.email,
      editPhone: user.phone,
      editUsername: user.username,
      editUserType: user.userType,
    },
    validationSchema: updateUserValidationSchema,

    onSubmit(values) {
      handleSubmitForm(values, resetForm);
    },
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter "
      centered
      backdrop="static"
      className="modal__container edit__user"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit User Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <form onSubmit={handleSubmit}>
          <div className="FieldGroup">
            <label htmlFor="fullName" style={{ marginTop: "-1rem" }}>
              Full Name
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={values["editFullName"]}
              name="editFullName"
              onChange={handleChange}
              handleblur={handleBlur}
            />
            <span className="error__msg">{errors["editFullName"]}</span>
          </div>

          <div className="FieldGroup">
            <label htmlFor="email" style={{ marginTop: "-1rem" }}>
              Email Address
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={values["editEmail"]}
              name="editEmail"
              onChange={handleChange}
              handleblur={handleBlur}
            />
            <span className="error__msg">{errors["editEmail"]}</span>
          </div>

          <div className="FieldGroup">
            <label htmlFor="phone" style={{ marginTop: "-1rem" }}>
              Phone Number
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={values["editPhone"]}
              name="editPhone"
              onChange={handleChange}
              handleblur={handleBlur}
            />
            <span className="error__msg">{errors["editPhone"]}</span>
          </div>

          <div className="FieldGroup">
            <label htmlFor="username" style={{ marginTop: "-1rem" }}>
              Username
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={values["editUsername"]}
              name="editUsername"
              onChange={handleChange}
              handleblur={handleBlur}
            />
            <span className="error__msg">{errors["editUsername"]}</span>
          </div>

          <div className="FieldGroup">
            <label htmlFor="userType">User Type</label>
            <select
              id="userType"
              className="Input w-100"
              disabled={viewEdit !== "edit"}
              value={values["editUserType"]}
              name="editUserType"
              onChange={handleChange}
              handleblur={handleBlur}
            >
              {userTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="error__msg">{errors["editUserType"]}</span>
          </div>

          {/* adminRoles checkbox options section */}

          {/* <div className="AdminRoles">
            <label htmlFor="adminRoles">Admin Roles</label>

            <div className="CheckboxContainer">
              {adminRoles?.map((option) => (
                <div key={option.value} className="CheckboxGroup">
                  <input
                    type="checkbox"
                    name="adminRoles"
                    checked={editAdminRoles.includes(option.value)}
                    id={option.value}
                    value={option.value}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        setEditAdminRoles([...editAdminRoles, e.target.value]);
                      } else {
                        setEditAdminRoles(
                          editAdminRoles.filter(
                            (item) => item !== e.target.value
                          )
                        );
                      }
                    }}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          </div> */}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose(resetForm);
          }}
        >
          Close
        </Button>

        {viewEdit === "edit" && (
          <Button variant="primary" type="button" onClick={handleSubmit}>
            {isLoading ? <PageLoader width="16px" /> : "Update"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;

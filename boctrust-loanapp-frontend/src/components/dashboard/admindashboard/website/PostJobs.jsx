import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import CareerList from "./CareerList";
import apiClient from "../../../../lib/axios";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  jobtitle: Yup.string().required("Jobs title is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.string().required("Image url is required"),
  dateposted: Yup.string().required("Job posted date is required"),
  deadline: Yup.string().required("Job closing date is required"),
});

const initialValues = {
  jobtitle: "",
  description: "",
  image: "",
  dateposted: "",
  deadline: "",
};

const PostJobs = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNew = () => setShowAddNew(true);
  const handleClose = () => setShowAddNew(false);
  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Handle form submission logic here
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("jobtitle", values.jobtitle);
      formData.append("image", values.image);
      formData.append("dateposted", values.dateposted);
      formData.append("deadline", values.deadline);
      formData.append("description", values.description);

      await apiClient.post(`/career/careers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("New Job Post addded successfully");
      resetForm(initialValues);
    } catch (error) {
      throw Error(error);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="MainBox">
      {!showAddNew ? (
        <div className="BlogSection">
          <div className="AddBtn">
            <BocButton func={handleAddNew} bgcolor="#ecaa00" bradius="22px">
              <span>+</span> Post Jobs
            </BocButton>
          </div>
          {/* top search bar */}
          <div className="Search">
            <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
              <div className="SearchBar">
                <div className="FormGroup">
                  <label htmlFor="show">Show</label>
                  <input
                    name="showCount"
                    type="number"
                    step={10}
                    min={10}
                    value={showCount}
                    onChange={(e) => setShowCount(e.target.value)}
                  />
                </div>

                {/* search bar input */}
                <div className="FormGroup SBox">
                  <input
                    name="search"
                    placeholder="Search"
                    value={searchTerms}
                    onChange={(e) => setSearchTerms(e.target.value)}
                  />
                  <img src="/images/search.png" alt="search-icon" />
                </div>
              </div>
            </DashboardHeadline>
          </div>
          <CareerList searchTerms={searchTerms} showCount={showCount} />
        </div>
      ) : (
        <div className="TransContainer">
          <DashboardHeadline>Post New Jobs</DashboardHeadline>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleBlur, setFieldValue, touched, errors }) => (
              <Form>
                <div className="FieldRow">
                  <div className="FieldGroup">
                    <label htmlFor="jobtitle">Job Title</label>
                    <Field
                      type="text"
                      name="jobtitle"
                      id="jobtitle"
                      className="Input"
                    />
                    <ErrorMessage
                      name="jobtitle"
                      component="div"
                      className="Error"
                    />
                  </div>

                  <div className="FieldGroup IUpload">
                    <label htmlFor="image">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept=".jpg, .jpeg, .png"
                      onBlur={handleBlur}
                      id="image"
                      className="Input"
                      onChange={(event) => {
                        setFieldValue("image", event.currentTarget.files[0]);
                      }}
                      style={{ paddingBottom: "38px", fontSize: "12px" }}
                    />
                    {errors.image && touched.image ? (
                      <div className="Error">{errors.image}</div>
                    ) : null}
                  </div>
                </div>

                <div className="FieldRow">
                  <div className="FieldGroup">
                    <label htmlFor="dateposted">Posted Date</label>
                    <Field
                      type="date"
                      name="dateposted"
                      id="dateposted"
                      className="Input"
                    />
                    <ErrorMessage
                      name="dateposted"
                      component="div"
                      className="Error"
                    />
                  </div>
                  <div className="FieldGroup">
                    <label htmlFor="deadline">Closing Date</label>
                    <Field
                      type="date"
                      name="deadline"
                      id="deadline"
                      className="Input"
                    />
                    <ErrorMessage
                      name="deadline"
                      component="div"
                      className="Error"
                    />
                  </div>
                </div>

                <div className="DescriptionJob">
                  <div className="FieldGroup">
                    <label htmlFor="description">Description</label>

                    <Field
                      as="textarea"
                      cols="30"
                      rows="10"
                      name="description"
                      id="description"
                      style={{
                        marginTop: "10px",
                        borderRadius: "8px",
                        padding: "18px",
                      }}
                    />

                    <ErrorMessage
                      name="description"
                      component="div"
                      className="Error"
                    />
                  </div>
                </div>

                <div className="row text-center my-4">
                  <div className="col-sm-12 col-md-6">
                    <BocButton
                      fontSize="1.6rem"
                      type="button"
                      width="220px"
                      margin="1rem 0"
                      bgcolor="gray"
                      bradius="18px"
                      func={handleClose}
                    >
                      Cancel
                    </BocButton>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <BocButton
                      fontSize="1.6rem"
                      type="submit"
                      width="220px"
                      margin="1rem 0"
                      bgcolor="#ecaa00"
                      bradius="18px"
                      disable={isLoading}
                    >
                      Submit{" "}
                      {isLoading && (
                        <PageLoader strokeColor="#145088" width="18px" />
                      )}
                    </BocButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default PostJobs;

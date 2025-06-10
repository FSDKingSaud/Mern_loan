/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./JobApplicationsList.css";

const JobApplicationsList = ({ count, searchTerms }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/job-application/applications`
        );
        setApplications(response.data);
        setFilteredApplications(response.data.slice(0, count));
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [count]);

  useEffect(() => {
    const searchApplications = () => {
      if (searchTerms) {
        const filtered = applications.filter(
          (application) =>
            application.name
              .toLowerCase()
              .includes(searchTerms.toLowerCase()) ||
            application.email.toLowerCase().includes(searchTerms.toLowerCase())
        );
        setFilteredApplications(filtered.slice(0, count));
      } else {
        setFilteredApplications(applications.slice(0, count));
      }
    };

    searchApplications();
  }, [applications, searchTerms, count]);

  const handleShowDetails = (application) => {
    setSelectedApplication(application);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setSelectedApplication(null);
  };

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/job-application/delete/${id}`);
      setApplications(applications.filter((app) => app._id !== id));
      setFilteredApplications(
        filteredApplications.filter((app) => app._id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };
  const handleDelete = async (id) => {
    // show warning before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (confirmDelete) {
      deleteApplication(id);
    }
  };

  return (
    <>
      <div className="ListSec">
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>Vacancy</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Cover Letter</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6">No applications found</td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application._id}>
                    <td>{application.vacancy.jobtitle}</td>
                    <td>{application.name}</td>
                    <td>{application.email}</td>
                    <td>{application.phone}</td>
                    <td>{application.coverLetter.substring(0, 50)}...</td>
                    <td>
                      <a href={`${apiUrl}/${application.resumePath}`} download>
                        Download
                      </a>
                    </td>
                    <td>
                      <div className="jobBtn">
                        <Button
                          variant="primary"
                          onClick={() => handleShowDetails(application)}
                        >
                          Details
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(application._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* applicant details modals */}
      <Modal show={modalShow} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <>
              <p>
                <strong>Name:</strong> {selectedApplication.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedApplication.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApplication.phone}
              </p>
              <p>
                <strong>Cover Letter:</strong> {selectedApplication.coverLetter}
              </p>
              <p>
                <strong>Vacancy:</strong> {selectedApplication.vacancy.jobtitle}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

JobApplicationsList.propTypes = {
  count: PropTypes.number,
  searchTerms: PropTypes.string,
};

export default JobApplicationsList;

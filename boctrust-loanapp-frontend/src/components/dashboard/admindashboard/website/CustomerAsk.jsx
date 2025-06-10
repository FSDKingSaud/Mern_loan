import { useEffect, useState } from "react";
import getDateOnly from "../../../../../utilities/getDate";
import Table from "react-bootstrap/Table";
import ActionNotification from "../../shared/ActionNotification";
import "../../Dashboard.css";
import EditInquiry from "./EditInquiry";
import apiClient from "../../../../lib/axios";

const CustomerAsk = () => {
  const [inquiries, setInquiries] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [action, setAction] = useState(false);
  const [inquiryId, setInquiryId] = useState("");
  const [inquiryObj, setInquiryObj] = useState({});

  const fetchInquiry = async () => {
    const { data } = await apiClient.get(`/inquiry/inquiries`);

    setInquiries(data.inquiries);
  };

  useEffect(() => {
    fetchInquiry();
  }, []);

  // handle edit action
  const handleEdit = () => {
    setOpenModel(true);
  };

  // handle select action
  const handleSelect = (e) => {
    const option = e.target.value;
    const id = e.target.id;
    setInquiryId(id);

    // filter wiki object by id
    const inquiry = inquiries.find((inquiry) => inquiry._id === id);
    setInquiryObj(inquiry);

    if (option === "edit") {
      handleEdit();
    } else if (option === "delete") {
      setAction(true);
    }
  };

  // handle delete action
  const handleDelete = async () => {
    await apiClient.delete(`/inquiry/inquiries/${inquiryId}`);
    fetchInquiry();
    setAction(false);
  };

  const styles = {
    head: {
      color: "#145098",
      fontSize: "1.2rem",
      backgroudColor: "#f9f9f9",
    },
    select: {
      backgroundColor: "#ecaa00",
      color: "#fff",
      border: "none",
      fontSize: "1rem",
      marginTop: "0.1rem",
      padding: "0.2rem 0.5rem",
    },
  };

  return (
    <>
      <div className="ListSec">
        <div style={styles.table}>
          <Table hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>Inquiry</th>
                <th>Subject</th>
                <th>Email</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries?.map((inquiry) => (
                <tr key={inquiry._id}>
                  <td>{inquiry.message}</td>
                  <td>{inquiry.subject}</td>
                  <td>{inquiry.email}</td>
                  <td>{getDateOnly(inquiry.createdAt)}</td>
                  <td>
                    <div>
                      <select
                        name="action"
                        id={inquiry._id}
                        onChange={(e) => handleSelect(e)}
                        style={styles.select}
                      >
                        <option value="">Action</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {/* model box */}
      <EditInquiry
        onHide={() => setOpenModel(false)}
        show={openModel}
        inquiry={inquiryObj}
      />
      {/* action notification */}
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

export default CustomerAsk;

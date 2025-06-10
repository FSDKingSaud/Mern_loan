import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContact } from "../../../../redux/reducers/contactFormReducer";
import getDateOnly from "../../../../../utilities/getDate";
import Table from "react-bootstrap/Table";
import PageLoader from "../../shared/PageLoader";
import ActionNotification from "../../shared/ActionNotification";
import "../../Dashboard.css";
import ViewContact from "./ViewContact";
import apiClient from "../../../../lib/axios";

const ContactForm = () => {
  const [openModel, setOpenModel] = useState(false);
  const [action, setAction] = useState(false);
  const [contactId, setContactId] = useState("");
  const [contactObj, setContactObj] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  const contacts = useSelector(
    (state) => state.contactFormReducer.contacts.contacts
  );
  const status = useSelector((state) => state.contactFormReducer.status);

  // handle select action
  const handleSelect = (e) => {
    const option = e.target.value;
    const id = e.target.id;
    setContactId(id);

    // filter wiki object by id
    const contact = contacts.find((contact) => contact._id === id);
    setContactObj(contact);

    if (option === "view") {
      setOpenModel(true);
    } else if (option === "reply") {
      console.log("Reply to email");
    } else if (option === "delete") {
      setAction(true);
    }
  };

  // handle delete action
  const handleDelete = async () => {
    await apiClient.delete(`/contact/contacts/${contactId}`);

    dispatch(fetchContact());
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
    w: {
      width: "15%",
    },
  };

  return (
    <>
      {status === "loading" ? (
        <PageLoader />
      ) : (
        <div className="ListSec">
          <div style={styles.table}>
            <Table hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th style={styles.w}>Date</th>
                  {/* <th style={styles.w}>Status</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts?.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact.fullName}</td>
                    <td>{contact.phoneNumber}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td>{getDateOnly(contact.createdAt)}</td>
                    {/* <td>New</td> */}
                    <td>
                      <div>
                        <select
                          name="action"
                          id={contact._id}
                          onChange={(e) => handleSelect(e)}
                          style={styles.select}
                        >
                          <option value="">Action</option>
                          <option value="view">View</option>
                          <option value="reply">Reply</option>
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
      )}

      <ViewContact
        onHide={() => setOpenModel(false)}
        show={openModel}
        data={contactObj}
      />
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

export default ContactForm;

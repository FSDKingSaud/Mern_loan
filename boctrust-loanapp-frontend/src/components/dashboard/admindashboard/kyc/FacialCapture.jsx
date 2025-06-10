import Headline from "../../../shared/Headline";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import "./Kyc.css";

const FacialCapture = () => {
  const styles = {
    btnBox: {
      display: "flex",
      justifyContent: "center",
    },
    table: {
      //   margin: "0 2rem 0 3rem",
      fontSize: "14px",
    },
    head: {
      color: "#fff",
      fontSize: "1rem",
    },
    approved: {
      color: "#5cc51c",
    },
    completed: {
      color: "#f64f4f",
    },
    padding: {
      color: "#ecaa00",
    },
  };

  return (
    <div>
      <div>
        <Headline text="View by:" />
        <div style={styles.btnBox} className="VBox">
          <BocButton margin="8px 18px" bgcolor="#ecaa00" bradius="25px">
            Recent Application
          </BocButton>
          <BocButton margin="8px 18px" bgcolor="#ecaa00" bradius="25px">
            Date Range
          </BocButton>
          <BocButton margin="8px 18px" bgcolor="#ecaa00" bradius="25px">
            Specific User
          </BocButton>
        </div>
      </div>

      {/* table section */}
      <div className="Section RBox DCard">
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -2.55rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Facial CapturPicture</th>
                <th>Time Stamp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>C001</td>
                <td>Cynthia Bola</td>
                <td style={styles.padding}>View Picture</td>
                <td>03-03-2023</td>
              </tr>
              <tr>
                <td>C003</td>
                <td>Ekene Ikoku</td>
                <td style={styles.padding}>View Picture</td>
                <td>04-03-2023</td>
              </tr>
              <tr>
                <td>C0018</td>
                <td>Akin Tinibu</td>
                <td style={styles.padding}>View Picture</td>
                <td>05-03-2023</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <NextPreBtn />
      </div>

      {/* kyc detail section */}
      <div className="KSection">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <Headline fontSize="24px" text=" Application Facial Capture View" />
            <div className="Capture DCard">
              <img
                src="/images/demofacial.png"
                alt="face-capture"
                className="FaceCapture"
              />
              <div className="TimeStamp">
                <p>Time Stamp:</p>
                <div>
                  <p>12/12/2020</p>
                  <p className="Time">12:00pm</p>
                </div>
              </div>
            </div>
            {/* <div>
              <Headline fontSize="24px" text="Signature View" />
              <img
                src="/images/signature1.png"
                alt="official signature"
                className="Signature"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialCapture;

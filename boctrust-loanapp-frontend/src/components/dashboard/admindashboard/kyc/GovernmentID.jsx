import Headline from "../../../shared/Headline";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import "./Kyc.css";

const GovernmentID = () => {
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
                <th>Document Submitted</th>
                <th>Time Stamp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>C001</td>
                <td>Cynthia Bola</td>
                <td style={styles.padding}>View ID</td>
                <td>03-03-2023</td>
              </tr>
              <tr>
                <td>C003</td>
                <td>Ekene Ikoku</td>
                <td style={styles.padding}>View ID</td>
                <td>04-03-2023</td>
              </tr>
              <tr>
                <td>C0018</td>
                <td>Akin Tinibu</td>
                <td style={styles.padding}>View ID</td>
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
            <Headline fontSize="24px" text="Valid ID Card View" />
            <div className="ICard">
              <img
                src="/images/officialid.png"
                alt="official-id"
                className="OfficialIdCard"
              />
              <div className="MatchCon">
                <Headline fontSize="16px" align="left" text="Admin Review" />
                <div className="Match">
                  <p>Is there a Match?</p>
                  <div className="Radio">
                    <input type="radio" id="yes" name="choice" value="yes" />
                    <label htmlFor="yes">Yes</label>

                    <input type="radio" id="no" name="choice" value="no" />
                    <label htmlFor="no">No</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentID;

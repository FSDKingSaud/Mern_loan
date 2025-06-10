import {Table} from "react-bootstrap";
import BocButton from "../../../shared/BocButton";
import DashboardHeadline from "../../../shared/DashboardHeadline";
import NextPreBtn from "../../../shared/NextPreBtn";


const LoanDueReport = () => {
   const styles = {
     table: {
       margin: "0 2rem 0 2rem",
     },
     head: {
       color: "#145098",
       fontSize: "1rem",
     },
     img: {
       width: "50px",
       height: "30px",
     },
     completed: {
       color: "#5cc51c",
     },
     search: {
       border: "1px solid #145098",
       width: "300px",
     }
   };
    
  return (
    <div>
      <div className="TransContainer">
        <DashboardHeadline>Loan Due Report</DashboardHeadline>
        {/* search form section */}
        <div className="FieldRow">
          <input type="text" placeholder="Search" style={styles.search} />
          <BocButton
            margin="0"
            fontSize="1.6rem"
            type="submit"
            bgcolor="#ecaa00"
            bradius="18px"
          >
            Submit
          </BocButton>
        </div>
      </div>
      {/* format section btn */}
      <div className="FormatBtn LDBox">
        <p>Output As:</p>
        <div>
          <BocButton bgcolor="gray">Copy</BocButton>
          <BocButton bgcolor="green">Excel</BocButton>
          <BocButton bgcolor="#145098">PDF</BocButton>
          <BocButton>Print</BocButton>
        </div>
      </div>
      <div className="ReportCon">
        {/* report table  */}
        <div>
          {/* <DashboardHeadline
            height="52px"
            mspacer="2rem 0 -2.7rem 0.2rem"
            bgcolor="#145098"
          ></DashboardHeadline> */}
          <div style={styles.table}>
            <Table hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Loan ID</th>
                  <th>Customer NO</th>
                  <th>Name</th>
                  <th>Loan Amount</th>
                  <th>Date Created</th>
                  <th>Total Due Amount</th>
                  <th>Due Date</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10023</td>
                  <td>1099234512</td>
                  <td>John Doe</td>
                  <td>N300,000</td>
                  <td>29-03-2023</td>
                  <td>N400,000</td>
                  <td>30-11-2023</td>
                  <td style={styles.completed}>N250,000</td>
                </tr>
                <tr>
                  <td>10041</td>
                  <td>1099234534</td>
                  <td>Bola Ahmad</td>
                  <td>N200,000</td>
                  <td>29-04-2023</td>
                  <td>N290,000</td>
                  <td>30-09-2023</td>
                  <td style={styles.completed}>N150,000</td>
                </tr>
                <tr>
                  <td>10022</td>
                  <td>1099234899</td>
                  <td>Mary Ikene</td>
                  <td>N60,000</td>
                  <td>12-03-2023</td>
                  <td>N75,000</td>
                  <td>30-07-2023</td>
                  <td style={styles.completed}>N50,000</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        {/* next prev btn  */}
        <NextPreBtn />
      </div>
    </div>
  );
};

export default LoanDueReport;

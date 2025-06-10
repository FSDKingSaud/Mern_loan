/* eslint-disable no-undef */
import PropTypes from "prop-types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "black",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: "16px",
    color: "#145980",
    textDecoration: "underline",
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  logo: {
    width: "30%",
    height: "30px",
  },
  avatar: {
    width: "80px",
    height: "80px",
  },
  hori: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  tbox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  p: {
    fontSize: 8,
    marginTop: "6px",
    wordBreak: "break-word",
    width: "30%",
  },
  infoSection: {
    borderBottom: "1px solid #ccc",
  },
  horiBox: {
    width: "40%",
  },
  table: {
    display: "table",
    width: "auto",
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCol: {
    width: "12.5%",
  },
  th: {
    margin: "auto",
    fontWeight: "bold",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomColor: "#b5b5b5",
    fontSize: "8px",
    width: "12.5%",
    padding: "2px",
    color: "#145980",
  },
  td: {
    margin: "auto",
    borderRightWidth: 1,
    borderBottomColor: "#b5b5b5",
    fontSize: "6px",
    padding: "2px",
    width: "12.5%",
    wordBreak: "break-word",
  },
  thh: {
    margin: "auto",
    fontWeight: "bold",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomColor: "#b5b5b5",
    fontSize: "6px",
    width: "8.5%",
    padding: "2px",
    color: "#145980",
  },
  tdd: {
    margin: "auto",
    borderRightWidth: 1,
    borderBottomColor: "#b5b5b5",
    fontSize: "6px",
    padding: "2px",
    width: "8.5%",
    wordBreak: "break-word",
  },
  thb: {
    margin: "auto",
    fontWeight: "bold",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomColor: "#b5b5b5",
    fontSize: "10px",
    width: "30.5%",
    padding: "2px",
    color: "#145980",
  },
  tdb: {
    margin: "auto",
    borderRightWidth: 1,
    borderBottomColor: "#b5b5b5",
    fontSize: "8px",
    padding: "2px",
    width: "30.5%",
    wordBreak: "break-word",
  },
  h2: {
    fontSize: "10px",
    color: "#145980",
    fontWeight: "bold",
    padding: "5px",
    marginTop: "6px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "10px",
  },
  card: {
    padding: "10px",
    border: "1px solid #ccc",
    width: "340px",
  },
});

const CRCCooporateReport = ({ report, formData }) => {
  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <div style={styles.hori}>
              <Image src="/images/crclogo.jpg" alt="logo" style={styles.logo} />
              <Image src="/images/boclogo.jpeg" alt="logo" style={styles.logo} />
              <Text> Credit Check Report</Text>
            </div>
          </View>

          <div style={styles.infoSection}>
            <View style={styles.section}>
              <div style={styles.hori}>
                <Text style={styles.title}>Enquiry Input Details</Text>
                <Image
                  src="/images/avater.jpg"
                  alt="logo"
                  style={styles.avatar}
                />
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Enquiry Date:</Text>
                <Text style={styles.p}>{formData.bureauDate || ""}</Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Enquiry Type:</Text>
                <Text style={styles.p}>Consumer Detailed Credit Report</Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Subscriber Name:</Text>
                <Text style={styles.p}>Boctrust MFB Ltd</Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Subscriber User Name:</Text>
                <Text style={styles.p}>
                  { report?.BODY?.SEARCHRESULTLIST && report.BODY.SEARCHRESULTLIST[0].NAME || ""}
                </Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Enquiry Reason:</Text>
                <Text style={styles.p}>Application for credit by a borrow</Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>BVN Number:</Text>
                <Text style={styles.p}>{formData.bvnNo || "N/A"}</Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Ref NO:</Text>
                <Text style={styles.p}>{report.REFERENCENO || "N/A"}</Text>
              </div>
            </View>
          </div>

          <div style={styles.infoSection}>
            <View style={styles.section}>
              <div style={styles.hori}>
                <Text style={styles.title}>Cooporate Classic Report</Text>
              </div>

              <div style={styles.grid}>
                {report?.BODY?.SEARCHRESULTLIST?.map((item, indx) => (
                  <div key={indx} style={styles.card}>
                    <div style={styles.tbox}>
                      <Text style={styles.p}>Name:</Text>
                      <Text style={styles.p}>{item.NAME || ""}</Text>
                    </div>
                    <div style={styles.tbox}>
                      <Text style={styles.p}>BureauID: </Text>
                      <Text style={styles.p}>{item.BUREAUID || ""}</Text>
                    </div>
                    <div style={styles.tbox}>
                      <Text style={styles.p}>Confidence Score:</Text>
                      <Text style={styles.p}>{item.CONFIDENCESCORE || ""}</Text>
                    </div>
                    <div style={styles.tbox}>
                      <Text style={styles.p}>Business Reg No:</Text>
                      <Text style={styles.p}>{item.BUSINESSREGNO || ""}</Text>
                    </div>
                    <div style={styles.tbox}>
                      <Text style={styles.p}>Phone Number:</Text>
                      <Text style={styles.p}>{item.PHONENUMBER || ""}</Text>
                    </div>
                    <div style={styles.tbox}>
                      <Text style={styles.p}>Address:</Text>
                      <Text style={styles.p}>
                        {item.ADDRESSES.ADDRESS || ""}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </View>
          </div>

        </Page>
      </Document>
    </PDFViewer>
  );
};

CRCCooporateReport.propTypes = {
  formData: PropTypes.shape({
    bureauDate: PropTypes.string,
    bvnNo: PropTypes.string,
  }),
  report: PropTypes.shape({
    BODY: PropTypes.shape({
      SEARCHRESULTLIST: PropTypes.any,
    }),
    REFERENCENO: PropTypes.string,
  }),
};

export default CRCCooporateReport;

/* eslint-disable no-undef */
import PropTypes from "prop-types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
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
    fontSize: 24,
    textAlign: "center",
    textDecoration: "underline",
    color: "#145980",
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
});

const PdfDocument = ({ report }) => {
  const { reportTitle, applicantName } = report;
  const { searchType, searchBy, searchDate, remarks } = report;
  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>
              {reportTitle ? reportTitle : "Boctrust Credit Check"}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>Name: {applicantName}</Text>
          </View>
          <View style={styles.section}>
            <Text>Search Type: {searchType}</Text>
          </View>
          <View style={styles.section}>
            <Text>IPPIS, BVN, or Phone No: {searchBy}</Text>
          </View>
          <View style={styles.section}>
            <Text>
              Search Date: {searchDate ? searchDate : "No search date"}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              Remarks:{" "}
              {remarks ? remarks : "No remarks provided by credit analyst"}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

PdfDocument.propTypes = {
  report: PropTypes.shape({
    reportTitle: PropTypes.string,
    applicantName: PropTypes.string,
    searchType: PropTypes.string,
    searchBy: PropTypes.string,
    searchDate: PropTypes.string,
    remarks: PropTypes.string,
  }),
};

export default PdfDocument;

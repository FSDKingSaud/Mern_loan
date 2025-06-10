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
});

const FirstCentralPdfReport = ({ report }) => {
  const {
    BankVerificationNo = "",
    BirthDate = "",
    CellularNo = "",
    Dependants = "",
    DriversLIcenseNo = "",
    EmailAddress = "",
    EmployerDetail = "",
    FirstName = "",
    Surname = "",
    Gender = "",
    HomeTelephoneNo = "",
    MaritalStatus = "",
    NationalIDNo = "",
    Nationality = "",
    OtherName = "",
    PassportNo = "",
    PencomIDNo = "",
    ResidentialAddress1 = "",
    WorkTelephoneNo = "",
    ReferenceNo = "",
    otheridNo = "",
  } = report[1]?.PersonalDetailsSummary[0] || {};
  const fullName = `${Surname} ${FirstName} ${OtherName || ""}` || "N/A";

  const {
    Amountarrear = "",
    LastBouncedChequesDate = "",
    LastJudgementDate = "",
    Rating = "",
    TotalAccountarrear = "",
    TotalAccounts = "",
    TotalDishonouredAmount = "",
    TotalJudgementAmount = "",
    TotalMonthlyInstalment = "",
    TotalNumberofDishonoured = "",
    TotalNumberofJudgement = "",
    TotalOutstandingdebt = "",
    TotalaccountinGoodcondition = "",
  } = report[3]?.CreditAccountSummary[0] || {};

  const creditAgreementSummary = report[5]?.CreditAgreementSummary || [];
  const accountMonthlyPaymentHistory = report[7]?.AccountMonthlyPaymentHistory|| [];
  const employmentHistory = report[13]?.EmploymentHistory || [];
  const enquiryHistory = report[10]?.EnquiryHistoryTop[0] || {};

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <div style={styles.hori}>
              <Image
                src="/images/firstcentrallogo.jpeg"
                alt="logo"
                style={styles.logo}
              />
              <Image src="/images/boclogo.jpeg" alt="logo" style={styles.logo} />
              <Text>Detailed Credit Check Report</Text>
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
                <Text style={styles.p}>
                  {enquiryHistory?.DateRequested || ""}
                </Text>
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
                <Text style={styles.p}>{fullName}</Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Enquiry Input:</Text>
                <Text style={styles.p}>N/A</Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Enquiry Reason:</Text>
                <Text style={styles.p}>Application for credit by a borrow</Text>
              </div>
              <div style={styles.tbox}>
                <Text style={styles.p}>Matching Rate:</Text>
                <Text style={styles.p}>{Rating}%</Text>
              </div>
            </View>
          </div>

          {/* personal details */}
          <div style={styles.infoSection}>
            <View style={styles.section}>
              <div style={styles.hori}>
                <Text style={styles.title}>Personal Details</Text>
              </div>

              <div style={styles.hori}>
                <div style={styles.horiBox}>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>FirstCentral Reference Number:</Text>
                    <Text style={styles.p}>{ReferenceNo || "N/A"}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Surname:</Text>
                    <Text style={styles.p}>{Surname || " "}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>First Name:</Text>
                    <Text style={styles.p}>{FirstName || " "}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Date of Birth:</Text>
                    <Text style={styles.p}>{BirthDate || " "}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Gender:</Text>
                    <Text style={styles.p}>{Gender || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Marital Status:</Text>
                    <Text style={styles.p}>{MaritalStatus || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>National ID Number:</Text>
                    <Text style={styles.p}>{NationalIDNo || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Driver&apos;s License Number:</Text>
                    <Text style={styles.p}>{DriversLIcenseNo || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Phone Number:</Text>
                    <Text style={styles.p}>{HomeTelephoneNo || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Mobile Number:</Text>
                    <Text style={styles.p}>{CellularNo || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Email Address:</Text>
                    <Text style={styles.p}>{EmailAddress || ""}</Text>
                  </div>
                </div>

                <div style={styles.horiBox}>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>
                      Bank Verification Number (BVN):
                    </Text>
                    <Text style={styles.p}>{BankVerificationNo || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Unique Tracking Number:</Text>
                    <Text style={styles.p}>{otheridNo || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>No. of Dependant:</Text>
                    <Text style={styles.p}>{Dependants || "0"}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>PENCOM ID:</Text>
                    <Text style={styles.p}>{PencomIDNo || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Passport Number:</Text>
                    <Text style={styles.p}>{PassportNo || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Nationality:</Text>
                    <Text style={styles.p}>{Nationality || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Residential Address:</Text>
                    <Text style={styles.p}>{ResidentialAddress1 || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Current Employer:</Text>
                    <Text style={styles.p}>{EmployerDetail || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Work Telephone:</Text>
                    <Text style={styles.p}>{WorkTelephoneNo || ""}</Text>
                  </div>
                </div>
              </div>
            </View>
          </div>

          {/* Credit Account Summary */}
          <div style={styles.infoSection}>
            <View style={styles.section}>
              <div style={styles.hori}>
                <Text style={styles.title}>Credit Account Summary</Text>
              </div>

              <div style={styles.hori}>
                <div style={styles.horiBo}>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Total Monthly Installments:</Text>
                    <Text style={styles.p}>
                      N{TotalMonthlyInstalment || "0.00"}
                    </Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Total Outstanding Debt:</Text>
                    <Text style={styles.p}>
                      {TotalOutstandingdebt || "0.00"}
                    </Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>
                      Total Number of Accounts in Arrears:
                    </Text>
                    <Text style={styles.p}>{TotalAccountarrear || "0"}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Total Arrear Amount:</Text>
                    <Text style={styles.p}>{Amountarrear || "0.00"}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>
                      Total Number of Accounts in Good Standing:
                    </Text>
                    <Text style={styles.p}>{TotalaccountinGoodcondition}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>
                      Total Number of Accounts Taken:
                    </Text>
                    <Text style={styles.p}>{TotalAccounts || "0"}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Total Number of Judgements:</Text>
                    <Text style={styles.p}>
                      {TotalNumberofJudgement || "0"}
                    </Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Total Judgement Amount:</Text>
                    <Text style={styles.p}>
                      {TotalJudgementAmount || "0'00"}
                    </Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Date of Last Judgement:</Text>
                    <Text style={styles.p}>{LastJudgementDate}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>
                      Total Number of Dishonoured Cheques:
                    </Text>
                    <Text style={styles.p}>
                      {TotalNumberofDishonoured || "0"}
                    </Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>
                      Total Amount of Dishonoured Cheques:
                    </Text>
                    <Text style={styles.p}>
                      {TotalDishonouredAmount || "0.00"}
                    </Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Date of Last Bounced Cheque :</Text>
                    <Text style={styles.p}>{LastBouncedChequesDate || ""}</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Total Number of Utilities:</Text>
                    <Text style={styles.p}>0</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Total Amount of Utilities:</Text>
                    <Text style={styles.p}>0.00</Text>
                  </div>
                  <div style={styles.tbox}>
                    <Text style={styles.p}>Date of Last Utility:</Text>
                    <Text style={styles.p}>N/A</Text>
                  </div>
                </div>
              </div>
            </View>
          </div>

          {/* Credit Agreements Summary */}
          <div style={styles.infoSection}>
            <View style={styles.section}>
              <div style={styles.hori}>
                <Text style={styles.title}>Credit Agreements Summary</Text>
              </div>

              <div>
                <View style={styles.section}>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={styles.th}>
                        <Text>Name</Text>
                      </View>
                      <View style={styles.th}>
                        <Text>Account NO.</Text>
                      </View>
                      <View style={styles.th}>
                        <Text>Availed Limit</Text>
                      </View>
                      <View style={styles.th}>
                        <Text>Outstd Balance</Text>
                      </View>
                      <View style={styles.th}>
                        <Text>Instalment Amount</Text>
                      </View>
                      <View style={styles.th}>
                        <Text>Arrear Amount</Text>
                      </View>
                      <View style={styles.th}>
                        <Text>Facility Classification</Text>
                      </View>
                      <View style={styles.th}>
                        <Text>Account Status</Text>
                      </View>
                    </View>
                    {creditAgreementSummary.map(
                      ({
                        AccountNo,
                        AccountStatus,
                        SubscriberName,
                        InstalmentAmount,
                        OpeningBalanceAmt,
                        CurrentBalanceAmt,
                        AmountOverdue,
                        PerformanceStatus,
                      }) => (
                        <View style={styles.tableRow} key={AccountNo}>
                          <View style={styles.td}>
                            <Text>{SubscriberName || ""}</Text>
                          </View>
                          <View style={styles.td}>
                            <Text>{AccountNo || ""}</Text>
                          </View>
                          <View style={styles.td}>
                            <Text>N{OpeningBalanceAmt || 0.0}</Text>
                          </View>
                          <View style={styles.td}>
                            <Text>N{CurrentBalanceAmt || "0.00"}</Text>
                          </View>
                          <View style={styles.td}>
                            <Text>N{InstalmentAmount || "0.00"}</Text>
                          </View>
                          <View style={styles.td}>
                            <Text>N{AmountOverdue || "0.00"}</Text>
                          </View>
                          <View style={styles.td}>
                            <Text>{PerformanceStatus || ""}</Text>
                          </View>
                          <View style={styles.td}>
                            <Text>{AccountStatus || ""}</Text>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </div>
            </View>
          </div>

          {/*Credit Agreements */}
          <div style={styles.infoSection}>
            <View style={styles.section}>
              <div style={styles.hori}>
                <Text style={styles.title}>Credit Agreements</Text>
              </div>
              <div>
                {accountMonthlyPaymentHistory.map(
                  ({
                    AccountNo,
                    AccountStatus,
                    CloseDate,
                    Currency,
                    CurrentBalanceAmt,
                    DateAccountOpened,
                    Header,
                    IndicatorDescription,
                    LastPaymentDate,
                    LastUpdatedDate,
                    LoanDuration,
                    M01,
                    M02,
                    M03,
                    M04,
                    M05,
                    M06,
                    M07,
                    M08,
                    M09,
                    M10,
                    M11,
                    M12,
                    M13,
                    M14,
                    M15,
                    M16,
                    M17,
                    M18,
                    M19,
                    M20,
                    M21,
                    M22,
                    M23,
                    M24,
                    MonthlyInstalmentAmt,
                    OpeningBalanceAmt,
                    PerformanceStatus,
                    RepaymentFrequencyCode,
                    SubscriberName,
                  }) => (
                    <div key={AccountNo}>
                      <Text style={styles.h2}>{Header || ""}</Text>

                      <div style={styles.hori}>
                        <div style={styles.horiBox}>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Subscriber Name:</Text>
                            <Text style={styles.p}>{SubscriberName || ""}</Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Effective Date:</Text>
                            <Text style={styles.p}>
                              {DateAccountOpened || ""}
                            </Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>
                              Type of Credit Facility:
                            </Text>
                            <Text style={styles.p}>
                              {IndicatorDescription || ""}
                            </Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Credit/Debit:</Text>
                            <Text style={styles.p}>N/A</Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Current Balance:</Text>
                            <Text style={styles.p}>
                              N{CurrentBalanceAmt || "0.00"}
                            </Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Arrear Amount:</Text>
                            <Text style={styles.p}>N/A</Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>
                              Facility classification:
                            </Text>
                            <Text style={styles.p}>
                              {PerformanceStatus || ""}
                            </Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Account Status:</Text>
                            <Text style={styles.p}>{AccountStatus || ""}</Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Repayment Frequency:</Text>
                            <Text style={styles.p}>
                              {RepaymentFrequencyCode || ""}
                            </Text>
                          </div>
                        </div>

                        <div style={styles.horiBox}>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Account Number:</Text>
                            <Text style={styles.p}>{AccountNo || ""}</Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Bureau Updated Date:</Text>
                            <Text style={styles.p}>
                              {LastUpdatedDate || ""}
                            </Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Currency:</Text>
                            <Text style={styles.p}>{Currency || ""}</Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>
                              Loan Amount/Credit Limit:
                            </Text>
                            <Text style={styles.p}>
                              N{OpeningBalanceAmt || "0.00"}
                            </Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Instalment Amount:</Text>
                            <Text style={styles.p}>
                              N{MonthlyInstalmentAmt || "0.00"}
                            </Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Expiry Date:</Text>
                            <Text style={styles.p}>{CloseDate || ""}</Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Last Payment Date:</Text>
                            <Text style={styles.p}>
                              {LastPaymentDate || ""}
                            </Text>
                          </div>
                          <div style={styles.tbox}>
                            <Text style={styles.p}>Loan Duration:</Text>
                            <Text style={styles.p}>{LoanDuration || ""}</Text>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Text style={styles.h2}>24 Months Payment History</Text>
                        <View style={styles.section}>
                          <View style={styles.table}>
                            <View style={styles.tableRow}>
                              <View style={styles.thh}>
                                <Text>M01</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M02</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M03</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M04</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M05</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M06</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M07</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M08</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M09</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M10</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M11</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M12</Text>
                              </View>
                            </View>

                            <View style={styles.tableRow}>
                              <View style={styles.tdd}>
                                <Text>{M01 == "#" ? "ND" : M01}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M02 == "#" ? "ND" : M02}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M03 == "#" ? "ND" : M03}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M04 == "#" ? "ND" : M04}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M05 == "#" ? "ND" : M05}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M06 == "#" ? "ND" : M06}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M07 == "#" ? "ND" : M07}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M08 == "#" ? "ND" : M08}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M09 == "#" ? "ND" : M09}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M10 == "#" ? "ND" : M10}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M11 == "#" ? "ND" : M11}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M12 == "#" ? "ND" : M12}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.section}>
                          <View style={styles.table}>
                            <View style={styles.tableRow}>
                              <View style={styles.thh}>
                                <Text>M13</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M14</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M15</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M16</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M17</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M18</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M19</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M20</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M21</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M22</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M23</Text>
                              </View>
                              <View style={styles.thh}>
                                <Text>M24</Text>
                              </View>
                            </View>

                            <View style={styles.tableRow}>
                              <View style={styles.tdd}>
                                <Text>{M13 == "#" ? "ND" : M13}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M14 == "#" ? "ND" : M14}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M15 == "#" ? "ND" : M15}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M16 == "#" ? "ND" : M16}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M17 == "#" ? "ND" : M17}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M18 == "#" ? "ND" : M18}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M19 == "#" ? "ND" : M19}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M20 == "#" ? "ND" : M20}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M21 == "#" ? "ND" : M21}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M22 == "#" ? "ND" : M22}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M23 == "#" ? "ND" : M23}</Text>
                              </View>
                              <View style={styles.tdd}>
                                <Text>{M24 == "#" ? "ND" : M24}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </div>
                    </div>
                  )
                )}
              </div>
            </View>
          </div>

          {/* Employment History */}
          <div style={styles.infoSection}>
            <View style={styles.section}>
              <div style={styles.hori}>
                <Text style={styles.title}>Employment History</Text>
              </div>

              <div>
                <View style={styles.section}>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={styles.thb}>
                        <Text>Bureau Update Date</Text>
                      </View>
                      <View style={styles.thb}>
                        <Text>Company</Text>
                      </View>
                      <View style={styles.thb}>
                        <Text>Occupation</Text>
                      </View>
                    </View>

                    {employmentHistory.map(
                      ({ EmployerDetails, Occupation, UpDateDate }) => (
                        <View
                          style={styles.tableRow}
                          key={EmployerDetails || ""}
                        >
                          <View style={styles.tdb}>
                            <Text>{EmployerDetails || ""}</Text>
                          </View>
                          <View style={styles.tdb}>
                            <Text>{UpDateDate || ""}</Text>
                          </View>
                          <View style={styles.tdb}>
                            <Text>{Occupation || ""}</Text>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </div>
            </View>
          </div>
        </Page>
      </Document>
    </PDFViewer>
  );
};

FirstCentralPdfReport.propTypes = {
  report: PropTypes.shape({
    Amountarrear: PropTypes.any,
    LastJudgementDate: PropTypes.any,
    TotalAccount: PropTypes.any,
    TotalAccountarrear: PropTypes.any,
    TotalMonthlyInstalment: PropTypes.any,
    TotalOutstandingdebt: PropTypes.any,
    applicantName: PropTypes.string,
    searchBy: PropTypes.string,
    searchDate: PropTypes.string,
    searchType: PropTypes.string,
  }),
};

export default FirstCentralPdfReport;

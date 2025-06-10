import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import { useEffect, useState } from "react";
import { fetchMyLoans } from "../../../../redux/reducers/loanReducer";
import PageLoader from "../../shared/PageLoader";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import { format } from "date-fns";

const styles = {
  head: {
    color: "#fff",
    fontSize: "0.9rem",
  },
};

const MyLoan = () => {
  const user = useSelector((state) => state.adminAuth.user);
  const { allLoans,  status } = useSelector(
    (state) => state.loanReducer
  );

  
    const [myLoans, setMyLoans] = useState(null)

  const dispatch = useDispatch();


  useEffect(() => {
    const getData = async () => {
      if (!user) return;
      try {
        await dispatch(fetchMyLoans(user._id));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

    useEffect(() => {
    if(allLoans){
      setMyLoans(allLoans.filter(loan => !loan.isTopUpLoan))
    }
    }, [allLoans]);

  return (
    <div className="MLoan">
      <DashboardHeadline
        height="46px"
        mspacer="2rem 0 -3.1rem 0"
        bgcolor="#145098"
      ></DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="DTable RBox"
      >
        <thead style={styles.head}>
          <tr>
            <th>Loan Acc</th>
            <th>Loan Product</th>
            <th>Applied Amount</th>
            <th>Total Payable</th>
            <th>Amount Paid</th>
            <th>Due Amount</th>
            <th>Release Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {!myLoans || status === "loading" ? (
            <tr>
              <td colSpan="8">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : myLoans && myLoans.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No loan record
              </td>
            </tr>
          ) : (
            myLoans.map((loan) => (
              <tr key={loan._id} className="smallText">
                <td>{loan?.loanAccountNumber?.slice(0, 5)}...</td>
                <td>{loan?.loanproduct.productTitle}</td>
                <td>
                  {nigerianCurrencyFormat.format(
                    loan?.loanInfo?.LoanAmount / 100 || loan?.loanamount || 0
                  )}
                </td>
                <td>
                  {nigerianCurrencyFormat.format(loan?.loantotalrepayment || 0)}
                </td>
                <td>
                  {nigerianCurrencyFormat.format(
                    loan?.accountBalance?.TotalAmountPaidTillDate || 0
                  )}
                </td>

                <td>
                  {nigerianCurrencyFormat.format(
                    loan?.accountBalance?.PrincipalDueButUnpaid +
                      loan?.accountBalance?.InterestDueButUnpaid +
                      loan?.accountBalance?.LoanFeeDueButUnPaid +
                      loan?.accountBalance?.PenaltyDueButUnpaid || 0
                  )}
                </td>
                <td>
                  {loan?.loanInfo?.DateCreated ? (
                    <div className="d-flex flex-column ">
                      <span>
                        {format(loan?.loanInfo?.DateCreated, "dd/LL/yyyy")}
                      </span>
                      <span className="">
                        {format(loan?.loanInfo?.DateCreated, "hh:mm aaa")}
                      </span>
                    </div>
                  ) : (
                    <span>-</span>
                  )}
                </td>

                <td>
                  <span
                    style={{
                      color: "white",
                    }}
                    className={`btn smallText ${
                      loan?.accountBalance?.TotalOutstandingAmount == null
                        ? "btn-secondary"
                        : loan?.accountBalance?.TotalOutstandingAmount
                        ? "btn-warning"
                        : "btn-success "
                    }`}
                  >
                    {loan?.accountBalance?.TotalOutstandingAmount == null
                      ? "Pending"
                      : loan?.accountBalance?.TotalOutstandingAmount > 0
                      ? "Not Paid"
                      : "Paid"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MyLoan;

import PropTypes from "prop-types";
import "../../../loanapplication/loanform/Form.css";
import Headline from "../../../shared/Headline";
import { IoArrowBackOutline } from "react-icons/io5";
import { filterBank } from "../../../loanapplication/loanform/fetchBanks";
import { useEffect, useState } from "react";

const KycViewDetails = ({ customer, loan, setShowInfo, hideLoanDetails }) => {
  return (
    <div>
      <div className="ConfirmationContainer">
        {/* customer details review */}
        <div>
          <div className="d-flex align-items-end gap-3">
            <span
              onClick={() => setShowInfo(false)}
              className="bg-transparent cursor-pointer  "
            >
              <IoArrowBackOutline size={20} />
            </span>
            <Headline
              align="left"
              spacer="28px 0 -6px 0"
              fontSize="22px"
              text="Customer Details"
            />
          </div>
          <hr />
          <div className="InputRow">
            <KycInput
              name="First Name"
              type="text"
              value={customer?.firstname || ""}
            />
            <div className="Space"></div>
            <KycInput
              name="Last Name"
              type="text"
              value={customer?.lastname || ""}
            />
          </div>

          <div className="InputRow">
            <KycInput name="Title" type="text" value={customer?.title || ""} />
            <div className="Space"></div>
            <KycInput
              name="Phone Number"
              type="text"
              value={customer?.phonenumber || ""}
            />
          </div>

          <div className="InputRow">
            <KycInput name="Email" type="text" value={customer?.email || ""} />
            <div className="Space"></div>
            <KycInput
              name="BVN"
              type="text"
              value={customer?.bvnnumber || ""}
            />
          </div>
          <div className="InputRow">
            <KycInput
              name="Marital Status"
              type="text"
              value={customer?.maritalstatus || ""}
            />
            <div className="Space"></div>
            <KycInput
              name="Date of Birth"
              type="text"
              value={customer?.dob || ""}
            />
          </div>

          <div className="InputRow">
            <KycInput
              name="No of Dependents"
              type="text"
              value={customer?.noofdependent || ""}
            />
            <div className="Space"></div>
            <KycInput
              name="Highest Level of Education"
              type="text"
              value={customer?.educationlevel || ""}
            />
          </div>

          <div className="InputRow">
            <KycInput
              name="State of Residence"
              type="text"
              value={customer?.stateofresidence || ""}
            />
            <div className="Space"></div>
            <KycInput
              name="LGA of Residence"
              type="text"
              value={customer?.lga || ""}
            />
          </div>

          <KycInput
            name="House Address"
            type="text"
            value={customer?.houseaddress || ""}
          />

          {customer.careertype.toLowerCase() === "government employee" ? (
            <div className="InputRow">
              <KycInput
                name="IPPIS Number"
                type="text"
                value={customer?.ippis || ""}
              />
              <div className="Space"></div>
              <KycInput
                name="Service Number"
                type="text"
                value={customer?.servicenumber || ""}
              />
            </div>
          ) : null}
        </div>

        {/* next of kin detail  */}
        <div>
          <Headline
            align="left"
            spacer="28px 0 -6px 0"
            fontSize="22px"
            text="Next of Kin Details"
          />
          <hr />

          <div className="InputRow">
            <KycInput
              name="First Name"
              type="text"
              value={customer?.nkinfirstname || ""}
            />
            <div className="Space"></div>
            <KycInput
              name="Last Name"
              type="text"
              value={customer?.nkinlastname || ""}
            />
          </div>

          <div className="InputRow">
            <KycInput
              name="Phone Number"
              type="text"
              value={customer?.nkinphonenumber || ""}
            />
            <div className="Space"></div>
            <KycInput
              name="Relationship"
              type="text"
              value={customer?.nkinrelationship || ""}
            />
          </div>
          <KycInput
            name="Residential Address"
            type="text"
            value={customer?.nkinresidentialaddress || ""}
          />
        </div>

        {/* Loan Details */}

        <div>
          <Headline
            align="left"
            spacer="28px 0 -6px 0"
            fontSize="22px"
            text="Loan Details"
          />
          <hr />
          {!hideLoanDetails && (
            <div className="InputRow">
              <KycInput
                name="Loan Amount"
                type="text"
                disabled
                value={loan?.loanamount || ""}
              />
              <div className="Space"></div>
              <KycInput
                name="Monthly Repayment"
                type="text"
                disabled
                value={loan?.monthlyrepayment || ""}
              />
            </div>
          )}
          {!hideLoanDetails && (
            <div className="InputRow">
              <KycInput
                name="Total Repayment"
                type="text"
                disabled
                value={loan?.loantotalrepayment || ""}
              />
              <div className="Space"></div>
              <KycInput
                name="No. of Month"
                type="text"
                disabled
                value={loan?.numberofmonth || ""}
              />
            </div>
          )}
        </div>

        {/* employment details */}
        {customer.careertype.toLowerCase() === "government employee" ? (
          <div>
            <Headline
              align="left"
              spacer="28px 0 -6px 0"
              fontSize="22px"
              text="Employment Details"
            />
            <hr />
            <KycInput
              name="Employer Name"
              type="text"
              value={customer?.employer?.employersName || ""}
            />

            <KycInput
              name="Employer Address"
              type="text"
              value={customer?.employeraddress || ""}
            />

            <KycInput
              name="Employment Start Date"
              type="text"
              value={customer?.employmentstartdate || ""}
            />

            <div className="InputRow">
              <KycInput
                name="Net Monthly Income"
                type="text"
                value={customer?.netmonthlyincome || ""}
              />
              <div className="Space"></div>
              <KycInput
                name="Total Annual Income"
                type="text"
                value={customer?.totalannualincome || ""}
              />
            </div>
            <KycInput
              name="Offical Email"
              type="text"
              value={customer?.officialemail || ""}
            />
          </div>
        ) : null}

        {/* financial details */}
        <div>
          <Headline
            align="left"
            spacer="28px 0 -6px 0"
            fontSize="22px"
            text="Financial Details"
          />
          <hr />
          <div className="InputRow">
            <KycInput
              name="Bank Name"
              type="text"
              value={customer?.bankcode || null}
            />
            <div className="Space"></div>
            <KycInput
              name="Account Number"
              type="text"
              value={customer?.salaryaccountnumber || null}
            />
          </div>

          {/* <div>
            <Headline
              spacer="28px 0 -18px 0"
              align="left"
              fontSize="18px"
              text="Disbursement Account"
            />
            <div className="InputRow">
              <KycInput
                name="Bank Name"
                type="text"
                value={customer.}
              
              />
              <div className="Space"></div>
              <KycInput
                name="Account Number"
                type="text"
                value={customer.}
              
              />
            </div>
          </div> */}

          {/* buyover loan details */}
          {customer.buyoverloan === "yes" ? (
            <div>
              <Headline
                spacer="28px 0 -18px 0"
                align="left"
                fontSize="18px"
                text="Buyover Loan Details"
              />
              <div className="InputRow">
                <KycInput
                  name="BeneficiaryName"
                  type="text"
                  value={customer?.beneficiaryname || ""}
                />
                <div className="Space"></div>
                <KycInput
                  name="Bank Number"
                  type="text"
                  value={customer?.beneficiarybank || ""}
                />
              </div>
              <div className="InputRow">
                <KycInput
                  name="Account Number"
                  type="text"
                  value={customer?.beneficiaryaccountnumber || ""}
                />
                <div className="Space"></div>
                <KycInput
                  name="Liquidation Balance"
                  type="text"
                  value={customer?.liquidationbalance || ""}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

KycViewDetails.propTypes = {
  customer: PropTypes.object,
  setShowInfo: PropTypes.func,
};

export default KycViewDetails;

const KycInput = ({ name, type, value }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (name === "Bank Name") {
      filterBank(value).then((data) => setInputValue(data));
    } else {
      setInputValue(value);
    }
  }, [name, value]);

  return (
    <div className="d-flex flex-column ">
      <label htmlFor={name}>{name}</label>
      <input
        type={type}
        className="TextInput border"
        name={name}
        value={inputValue || ""}
      />
    </div>
  );
};

KycInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
};

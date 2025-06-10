import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import ConfirmField from "./ConfirmField";
import Headline from "../../shared/Headline";
import "./Form.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSelectedProduct } from "../../../redux/reducers/productReducer";
import { calculateSimpleInterest } from "../../shared/calculatorfunc";

const ConfirmData = ({ career }) => {
  const { values, setFieldValue } = useFormikContext();

  const loanProducts = useSelector((state) => state.productReducer.products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSelectedProduct());
  }, [dispatch]);

  const calculateRepayment = () => {
    // get product id from formik values
 
    const productId = values.loanproduct;
 
    const noOfMonths = values.numberofmonth;


    if (!productId || !noOfMonths) {
      return toast.error("Please Enter All Fields ");
    }

    // find product
    const product = loanProducts?.find((product) => product._id === productId);

    // get interest rate
    const loanRate = product?.interestRate;

    if(!values.loanamount || !loanRate || !noOfMonths) return 

    const { monthlyPayment: monthlyPay } = calculateSimpleInterest(
      parseInt(values.loanamount.replace(/,/g, "")),
      loanRate,
      noOfMonths
    );

    setFieldValue("monthlyRepayment", monthlyPay);
  };

  useEffect(() => {
    calculateRepayment();
  }, [values.loanamount ])


  const handleInputChange = (fieldName, event) => {
   
   // Update the field value as the user types
    setFieldValue(fieldName, event.target.value);
  };

  return (
    <>
      <div className="ConfirmationContainer">
        {/* customer details review */}
        <div>
          <Headline
            align="left"
            spacer="28px 0 -6px 0"
            fontSize="22px"
            text="Customer Details"
          />
          <hr />
          <div className="InputRow">
            <ConfirmField
              labelName="First Name"
              fieldName="firstname"
              type="text"
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="Last Name"
              fieldName="lastname"
              type="text"
              values={values}
              func={handleInputChange}
            />
          </div>

          <div className="InputRow">
            <ConfirmField
              labelName="Title"
              fieldName="title"
              type="text"
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="Phone Number"
              fieldName="phonenumber"
              type="text"
              values={values}
              func={handleInputChange}
            />
          </div>

          <ConfirmField
            labelName="Email"
            fieldName="email"
            type="text"
            values={values}
            func={handleInputChange}
          />

          <div className="InputRow">
            <ConfirmField
              labelName="Marital Status"
              fieldName="maritalstatus"
              type="text"
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="Date of Birth"
              fieldName="dob"
              type="text"
              values={values}
              func={handleInputChange}
            />
          </div>

          <div className="InputRow">
            <ConfirmField
              labelName="No of Dependents"
              fieldName="noofdependent"
              type="text"
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="Highest Level of Education"
              fieldName="educationlevel"
              type="text"
              values={values}
              func={handleInputChange}
            />
          </div>

          <div className="InputRow">
            <ConfirmField
              labelName="State of Residence"
              fieldName="stateofresidence"
              type="text"
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="LGA of Residence"
              fieldName="lga"
              type="text"
              values={values}
              func={handleInputChange}
            />
          </div>

          <ConfirmField
            labelName="House Address"
            fieldName="houseaddress"
            type="text"
            values={values}
            func={handleInputChange}
          />

          {career.toLowerCase() === "government employee" ? (
            <div className="InputRow">
              <ConfirmField
                labelName="IPPIS Number"
                fieldName="ippis"
                type="text"
                values={values}
                func={handleInputChange}
              />
              <div className="Space"></div>
              <ConfirmField
                labelName="Service Number"
                fieldName="servicenumber"
                type="text"
                values={values}
                func={handleInputChange}
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
            <ConfirmField
              labelName="First Name"
              fieldName="nkinfirstname"
              type="text"
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="Last Name"
              fieldName="nkinlastname"
              type="text"
              values={values}
              func={handleInputChange}
            />
          </div>

          <div className="InputRow">
            <ConfirmField
              labelName="Phone Number"
              fieldName="nkinphonenumber"
              type="text"
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="Relationship"
              fieldName="nkinrelationship"
              type="text"
              values={values}
              func={handleInputChange}
            />
          </div>
          <ConfirmField
            labelName="Residential Address"
            fieldName="nkinresidentialaddress"
            type="text"
            values={values}
            func={handleInputChange}
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
          <div className="InputRow">
            <ConfirmField
              labelName="Loan Amount"
              fieldName="loanamount"
              type="text"
              disabled
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="Monthly Repayment"
              fieldName="monthlyRepayment"
              type="text"
              disabled
              values={values}
              func={handleInputChange}
            />
          </div>
        </div>

        {/* employment details */}
        {career.toLowerCase() === "government employee" ? (
          <div>
            <Headline
              align="left"
              spacer="28px 0 -6px 0"
              fontSize="22px"
              text="Employment Details"
            />
            <hr />
            <ConfirmField
              labelName="Employer Name"
              fieldName="employerId"
              type="text"
              values={values}
              func={handleInputChange}
            />

            <ConfirmField
              labelName="Employer Address"
              fieldName="employeraddress"
              type="text"
              values={values}
              func={handleInputChange}
            />

            <ConfirmField
              labelName="Employment Start Date"
              fieldName="employmentstartdate"
              type="text"
              values={values}
              func={handleInputChange}
            />

            <div className="InputRow">
              <ConfirmField
                labelName="Net Monthly Income"
                fieldName="netmonthlyincome"
                type="text"
                values={values}
                func={handleInputChange}
              />
              <div className="Space"></div>
              <ConfirmField
                labelName="Total Annual Income"
                fieldName="totalannualincome"
                type="text"
                values={values}
                func={handleInputChange}
              />
            </div>

            <ConfirmField
              labelName="Offical Email"
              fieldName="officialemail"
              type="text"
              values={values}
              func={handleInputChange}
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
            <ConfirmField
              labelName="Account Name"
              fieldName="salaryaccountname"
              type="text"
              values={values}
              func={handleInputChange}
            />
            <div className="Space"></div>
            <ConfirmField
              labelName="Bank Name"
              fieldName="bankcode"
              type="text"
              values={values}
              func={handleInputChange}
              disabled
            />
          </div>
          <div className="w-50">
            <ConfirmField
              labelName="Account Number"
              fieldName="salaryaccountnumber"
              type="text"
              values={values}
              func={handleInputChange}
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
              <ConfirmField
                labelName="Bank Name"
                fieldName="salaryaccountname"
                type="text"
                values={values}
                func={handleInputChange}
              />
              <div className="Space"></div>
              <ConfirmField
                labelName="Account Number"
                fieldName="salaryaccountnumber"
                type="text"
                values={values}
                func={handleInputChange}
              />
            </div>
          </div> */}

          {/* buyover loan details */}
          {values.buyoverloan === "yes" ? (
            <div>
              <Headline
                spacer="28px 0 -18px 0"
                align="left"
                fontSize="18px"
                text="Buyover Loan Details"
              />
              <div className="InputRow">
                <ConfirmField
                  labelName="BeneficiaryName"
                  fieldName="beneficiaryname"
                  type="text"
                  values={values}
                  func={handleInputChange}
                />
                <div className="Space"></div>
                <ConfirmField
                  labelName="Bank Number"
                  fieldName="beneficiarybank"
                  type="text"
                  values={values}
                  func={handleInputChange}
                />
              </div>
              <div className="InputRow">
                <ConfirmField
                  labelName="Account Number"
                  fieldName="beneficiaryaccountnumber"
                  type="text"
                  values={values}
                  func={handleInputChange}
                />
                <div className="Space"></div>
                <ConfirmField
                  labelName="Liquidation Balance"
                  fieldName="liquidationbalance"
                  type="text"
                  values={values}
                  func={handleInputChange}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

ConfirmData.propTypes = {
  career: PropTypes.string,
};

export default ConfirmData;

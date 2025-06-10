const getErrorText = (code) => {
  let errorText = "";
  switch (code) {
    case "01":
      errorText = " Status unknown, please wait for settlement report";
      break;
    case "03":
      errorText = "  Invalid Sender";
      break;
    case "05":
      errorText = " Do not honor";
      break;
    case "06":
      errorText = "  Dormant Account";
      break;
    case "07":
      errorText = " Invalid Account";
      break;
    case "08":
      errorText = "  Account Name Mismatch";
      break;
    case "09":
      errorText = "  Request processing in progress";
      break;
    case "12":
      errorText = " Invalid transaction";
      break;
    case "13":
      errorText = " Invalid Amount";
      break;
    case "14":
      errorText = "  Invalid Batch Number";
      break;
    case "15":
      errorText = "  Invalid Session or Record ID";
      break;
    case "16":
      errorText = " Unknown Bank Code";
      break;
    case "17":
      errorText = " Invalid Channel	";
      break;
    case "18":
      errorText = " Wrong Method Call	";
      break;
    case "21":
      errorText = " No action taken		";
      break;
    case "25":
      errorText = "Unable to locate record	";
      break;
    case "26":
      errorText = "Duplicate record	";
      break;
    case "30":
      errorText = "Format error	";
      break;
    case "34":
      errorText = "Suspected fraud		";
      break;
    case "35":
      errorText = "Contact sending bank";
      break;
    case "51":
      errorText = "Insufficient funds	";
      break;
    case "57":
      errorText = "Transaction not permitted to sender	";
      break;
    case "58":
      errorText = "Transaction not permitted on channel		";
      break;
    case "61":
      errorText = "Transfer limit Exceeded";
      break;
    case "63":
      errorText = "Security violation";
      break;
    case "65":
      errorText = "Exceeds withdrawal frequency";
      break;
    case "68":
      errorText = "Response received too late";
      break;
    case "69":
      errorText = " Unsuccessful Account/Amount block";
      break;
    case "70":
      errorText = "Unsuccessful Account/Amount unblock";
      break;
    case "71":
      errorText = "Empty Mandate Reference Number";
      break;
    case "91":
      errorText = "Beneficiary Bank not available	r";
      break;
    case "92":
      errorText = " Routing error";
      break;
    case "94":
      errorText = "Duplicate transaction";
      break;
    case "96":
      errorText = "System malfunction";
      break;
    case "97":
      errorText = "Timeout waiting for response from destination";
      break;
    case "A1":
      errorText = " Client disabled";
      break;
    case "A2":
      errorText = "Not found";
      break;
    case "A3":
      errorText = "Expired";
      break;
    case "A4":
      errorText = "Empty value";
      break;
    case "A5":
      errorText = "Invalid value";
      break;
    case "A6":
      errorText = "invalid data provided";
      break;
    case "A7":
      errorText = "Remote IP not permitted";
      break;
    case "A8":
      errorText = "Invalid client ID";
      break;
    case "A9":
      errorText = "Unable to process request, please try again";
      break;
    case "B0":
      errorText = "I Mandate Bank mismatch";
      break;
    case "B1":
      errorText = "Mandate Account Mismatch";
      break;
    default:
      errorText = "Something went wrong";
      break;
  }

  return errorText;
};

module.exports = { getErrorText };

const formData = (formValues) => {
  const formData = new FormData();
  formData.append("loanamount", formValues.loanamount);
  formData.append("careertype", formValues.careertype);
  formData.append("numberofmonth", formValues.numberofmonth);
  formData.append("loanproduct", formValues.loanproduct);
  formData.append("loanpurpose", formValues.loanpurpose);
  formData.append("otherpurpose", formValues.otherpurpose);
  formData.append("bvnnumber", formValues.bvnnumber);
  formData.append("title", formValues.title);
  formData.append("firstname", formValues.firstname);
  formData.append("lastname", formValues.lastname);
  formData.append("phonenumber", formValues.phonenumber);
  formData.append("dob", formValues.dob);
  formData.append("email", formValues.email);
  formData.append("maritalstatus", formValues.maritalstatus);
  formData.append("noofdependent", formValues.noofdependent);
  formData.append("educationlevel", formValues.educationlevel);
  formData.append("howdidyouhearaboutus", formValues.howdidyouhearaboutus);
  formData.append("houseaddress", formValues.houseaddress);
  formData.append("stateofresidence", formValues.stateofresidence);
  formData.append("lga", formValues.lga);
  formData.append("stateoforigin", formValues.stateoforigin);
  formData.append("ippis", formValues.ippis);
  formData.append("servicenumber", formValues.servicenumber);
  formData.append("valididcard", formValues.valididcard);
  formData.append("idcardnotinclude", formValues.idcardnotinclude);
  formData.append("nkinfirstname", formValues.nkinfirstname);
  formData.append("nkinlastname", formValues.nkinlastname);
  formData.append("nkinphonenumber", formValues.nkinphonenumber);
  formData.append("nkinrelationship", formValues.nkinrelationship);
  formData.append("nkinresidentialaddress", formValues.nkinresidentialaddress);
  formData.append("employer", formValues.employerId);
  formData.append("otheremployername", formValues.otheremployername);
  formData.append("employeraddress", formValues.employeraddress);
  formData.append("employmentstartdate", formValues.employmentstartdate);
  formData.append("employmentletter", formValues.employmentletter);
  formData.append("netmonthlyincome", formValues.netmonthlyincome);
  formData.append("totalannualincome", formValues.totalannualincome);
  formData.append("officialemail", formValues.officialemail);
  formData.append("uploadpayslip", formValues.uploadpayslip);

  // financial info
  formData.append("salaryaccountname", formValues.salaryaccountname);
  formData.append("salaryaccountnumber", formValues.salaryaccountnumber);

  formData.append("disbursementbankname", formValues.disbursementbankname);
  formData.append(
    "disbursementaccountnumber",
    formValues.disbursementaccountnumber
  );
  formData.append("hasloan", formValues.hasloan);
  formData.append(
    "currentmonthlyplanrepaymentamount",
    formValues.currentmonthlyplanrepaymentamount
  );
  formData.append(
    "estimatedmonthlylivingexpense",
    formValues.estimatedmonthlylivingexpense
  );
  formData.append("buyoverloan", formValues.buyoverloan);
  formData.append("beneficiaryname", formValues.beneficiaryname);
  formData.append("beneficiarybank", formValues.beneficiarybank);
  formData.append(
    "beneficiaryaccountnumber",
    formValues.beneficiaryaccountnumber
  );
  formData.append("liquidationbalance", formValues.liquidationbalance);
  formData.append("deductions", formValues.deductions);
  formData.append("guarantee", formValues.guarantee);

  // agree and sign
  formData.append("acceptterms", formValues.acceptterms);
  formData.append("acceptpolicy", formValues.acceptpolicy);
  formData.append("sharemyremita", formValues.sharemyremita);
  formData.append("agreeNibbsDebit", formValues.agreeNibbsDebit);
  formData.append("agreefullname", formValues.agreefullname);
  formData.append("agreedate", formValues.agreedate);
  formData.append("signature", formValues.signature);
  formData.append("photocapture", formValues.photocapture);
  formData.append("haveagent", formValues.haveagent);
  formData.append("agentcode", formValues.agentcode);
  formData.append("username", formValues.username);
  formData.append("password", formValues.password);
  formData.append("confirmpassword", formValues.confirmpassword);
};

export default formData;

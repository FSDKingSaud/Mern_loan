import * as Yup from "yup";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.string().required("Date of Birth is required"),
    email: Yup.string().required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    stateOfOrigin: Yup.string().required("State of Origin is required"),
    stateOfResidence: Yup.string().required("State of Residence is required"),
    lga: Yup.string().required("LGA is required"),
    city: Yup.string().required("City is required"),
    maritalStatus: Yup.string().required("Marital Status is required"),
    occupation: Yup.string().required("Occupation is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    photo: Yup.string().required("Photo is required"),
    idCard: Yup.string().required("ID Card is required"),
    branch: Yup.string().required("Branch is required"),
    loanOfficer: Yup.string().required("Loan Officer is required"),
});

export default validationSchema;

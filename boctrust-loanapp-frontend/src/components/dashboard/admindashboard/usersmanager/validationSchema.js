import * as Yup from "yup";
// Define validation schema using Yup

const MAX_FILE_SIZE = 200 * 1024; // 200KB

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  photo: Yup.mixed().required("Photo is required").test("fileSize", "File size exceeds 200KB", (value) => {
    return value && value.size <= MAX_FILE_SIZE;
  }),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in E.164 format (e.g., +2347047202860)"
    )
    .required("Phone number is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/,
      "Password must contain at least 8 characters, one letter, one number, and one special character"
    ),
  userType: Yup.string().required("User type is required"),
  userRole: Yup.string().required("Admin role is required"),
});

export default validationSchema;

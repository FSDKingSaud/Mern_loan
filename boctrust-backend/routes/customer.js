const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const CustomerModel = require("../models/Customer"); // Import customer model
const Loan = require("../models/Loan");
const Employer = require("../models/EmployersManager");
const {
  getLoanByCustomerId,
} = require("../services/bankoneOperationsServices");
const {
  authenticateCustomerToken,
  authenticateToken,
} = require("../middleware/auth");
const SelectedLoanOfficers = require("../models/SelectedLoanOfficers");
const { default: axios } = require("axios");
const Settings = require("../models/Settings");
const defaultEmailConfig = require("../config/email");
const {
  getUsersToSendNotificationFromTarget,
  saveAndSendNotification,
} = require("../services/notification.service");

// configure dotenv
dotenv.config();

const password = process.env.EMAIL_PASSWORD;

// Set up Multer storage to define where to save the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/filesUpload/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file with a unique name
  },
});

const upload = multer({
  storage: storage,
});

const multipleUpload = upload.fields([
  { name: "valididcard" },
  { name: "uploadpayslip" },
  { name: "uploadbankstatement" },
  { name: "signature" },
  { name: "photocapture" },
  { name: "employmentletter" },
  { name: "marketerClientPic" },
]);
// multer configuration end here

// Create a new customer
router.post("/customer", multipleUpload, async (req, res) => {
  if (req.files.valididcard?.length > 0) {
    req.body.valididcard = req.files.valididcard[0].filename;
  }
  if (req.files.uploadpayslip?.length > 0) {
    req.body.uploadpayslip = req.files.uploadpayslip[0].filename;
  }
  if (req.files.uploadbankstatement?.length > 0) {
    req.body.uploadbankstatement = req.files.uploadbankstatement[0].filename;
  }
  if (req.files.signature?.length > 0) {
    req.body.signature = req.files.signature[0].filename;
  }
  if (req.files.photocapture?.length > 0) {
    req.body.photocapture = req.files.photocapture[0].filename;
  }
  if (req.files.employmentletter?.length > 0) {
    req.body.employmentletter = req.files.employmentletter[0].filename;
  }
  if (req.files.marketerClientPic?.length > 0) {
    req.body.marketerClientPic = req.files.marketerClientPic[0].filename;
  }

  // hash password
  // check if user already exist
  // Validate if user exist in our database

  const token = process.env.BANKONE_TOKEN;
  const baseUrl = process.env.BANKONE_BASE_URL;
  const mfbcode = "100579";

  try {
    const { email, username, employer } = req.body;
    const oldUser = await CustomerModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (oldUser) {
      return res
        .status(409)
        .json({ error: "User Already Exist. Please Login" });
    }

    // Encrypt user password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.confirmpassword = await bcrypt.hash(req.body.confirmpassword, 10);

    // assign a random account officer
    const selectedAccountOfficers = await SelectedLoanOfficers.findOne();
    const randomIndex = Math.floor(
      Math.random() * selectedAccountOfficers?.SelectedLoanOfficers.length || 0
    );

    const { data: accountOfficersData } = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/AccountOfficer/Get/2?authToken=${token}&mfbCode=${mfbcode}`
    );

    const assignedAccOfficer =
      selectedAccountOfficers &&
      selectedAccountOfficers.SelectedLoanOfficers.length > 0
        ? accountOfficersData.find(
            (item) =>
              item.Name ==
              selectedAccountOfficers.SelectedLoanOfficers[randomIndex]
          )
        : accountOfficersData[0];

    const customer = await CustomerModel.create({
      ...req.body,
      agentCode: assignedAccOfficer.Code,
      employer: employer && employer != "undefined" ? employer : null,
    });

    const newLoan = await Loan.create({
      customer: customer._id,
      loanproduct: req.body.loanproduct,
      loanamount: req.body.loanamount,
      monthlyrepayment: req.body.monthlyrepayment,
      buyoverloan: req.body.buyoverloan,
      numberofmonth: req.body.numberofmonth,
      loantotalrepayment: req.body.loantotalrepayment,
      loanpurpose: req.body.loanpurpose,
      otherpurpose: req.body.otherpurpose,
      deductions: req.body.deductions,
    });

    const usersToSend = await getUsersToSendNotificationFromTarget("admins");

    await saveAndSendNotification({
      targetUsers: usersToSend,
      message: `New loan application arrival of NGN${req.body.loanamount} by ${
        req.body.firstname + " " + req.body.lastname
      } `,
      type: "loan",
      metadata: {
        loan: newLoan._id,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Unable to create customer" });
  }
});

// customer login
router.post("/login", async (req, res) => {
  try {
    // get user input
    const { username, password } = req.body;

    // validate user input
    if (!(username && password)) {
      return res.status(400).json({ error: "All input is required" });
    }

    // find customer by username
    const customer = await CustomerModel.findOne({ username }).populate({
      path: "employer",
      populate: [
        {
          path: "mandateRule",
          model: "MandateRule",
        },
        {
          path: "statementRule",
          model: "StatementRule",
        },
        {
          path: "employerLetterRule",
          model: "EmployerLetterRule",
        },
      ],
    });

    // validate if user exist in our database and create token
    if (customer && bcrypt.compare(password, customer.password)) {
      // Create token
      const token = jwt.sign(
        { customer_id: customer._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save customer token
      customer.token = token;

      // map customer to include image URLs
      const customerWithImages = {
        ...customer.toJSON(),
        photocaptureImg: `${baseUrl}/public/filesUpload/${customer.photocapture}`,
      };

      // Add customer active loan to payload
      if (customer.banking?.isAccountCreated) {
        const customerLoanAccounts = await getLoanByCustomerId(
          customer.banking?.accountDetails.CustomerID
        );

        const activeLoanAccount = customerLoanAccounts.find(
          (account) =>
            account.RealLoanStatus === "Active" && !account.IsLoanWrittenOff
        );

        customerWithImages.activeLoan = activeLoanAccount;
      }

      const refreshToken = jwt.sign(
        { user_id: customer._id, username },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: "7d" }
      );

      // Create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });

      console.log(customerWithImages, "customerWithImages");

      return res
        .status(200)
        .json({ success: "Login successful", customer: customerWithImages });
    }
    return res.status(400).json({ error: "Invalid Credentials" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/checkValidEmail", async (req, res) => {
  try {
    const customerExist = await CustomerModel.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (customerExist) {
      res.status(400).json({
        error: "Email Already Exist",
      });
    } else {
      res.status(200).json({
        message: "Email is Valid",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to fetch customer" });
  }
});

// Read all customer
const baseUrl = process.env.BASE_URL;

router.get("/customers", authenticateToken, async (req, res) => {
  try {
    const { isKycApproved } = req.query;
    let filter = {};
    if (isKycApproved) {
      filter = {
        "kyc.isKycApproved": true,
      };
    }

    const customer = await CustomerModel.find(filter)
      .populate("employer")
      .sort({ createdAt: -1 });

    // exclude password and confirm password from customer
    customer.forEach((customer) => {
      customer.password = undefined;
      customer.confirmpassword = undefined;

      if (!customer.employer) {
        const psuedoEmployer = new Employer({
          employersId: `E00${Math.floor(Math.random() * 100) + 1} `,
          employersName: customer?.otheremployername,
          employersAddress: customer?.employeraddress,
        });

        customer.employer = psuedoEmployer;
      }
    });

    // Map users to include image URLs
    const customerWithImages = customer.map((customer) => {
      return {
        ...customer.toJSON(),
        valididcard: customer.valididcard
          ? `${baseUrl}/public/filesUpload/${customer.valididcard}`
          : null,
        uploadpayslip: customer.uploadpayslip
          ? `${baseUrl}/public/filesUpload/${customer.uploadpayslip}`
          : null,
        uploadbankstatement: customer.uploadbankstatement
          ? `${baseUrl}/public/filesUpload/${customer.uploadbankstatement}`
          : null,
        signature: customer.signature
          ? `${baseUrl}/public/filesUpload/${customer.signature}`
          : null,
        employmentletter: customer.employmentletter
          ? `${baseUrl}/public/filesUpload/${customer.employmentletter}`
          : null,
        photocaptureImg: customer.photocapture
          ? `${baseUrl}/public/filesUpload/${customer.photocapture}`
          : null,
        marketerClientPic: customer.marketerClientPic
          ? `${baseUrl}/public/filesUpload/${customer.marketerClientPic}`
          : null,
      };
    });

    // Return success response with users and image URLs
    return res.status(200).json({ customer: customerWithImages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to fetch customer" });
  }
});

// Read a customer by ID
router.get("/customer/:customerId", authenticateToken, async (req, res) => {
  try {
    let customer = await CustomerModel.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    customer = {
      ...customer.toJSON(),
      valididcard: `${baseUrl}/public/filesUpload/${customer.valididcard}`,
      uploadpayslip: `${baseUrl}/public/filesUpload/${customer.uploadpayslip}`,
      uploadbankstatement: `${baseUrl}/public/filesUpload/${customer.uploadbankstatement}`,
      signature: `${baseUrl}/public/filesUpload/${customer.signature}`,
      employmentletter: `${baseUrl}/public/filesUpload/${customer.employmentletter}`,
      photocaptureImg: `${baseUrl}/public/filesUpload/${customer.photocapture}`,
    };

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch customer" });
  }
});

// Update a customer by ID
router.put(
  "/customer/:customerId",
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const customer = await CustomerModel.findByIdAndUpdate(
        req.params.customerId,
        req.body,
        {
          new: true,
        }
      );
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Unable to update customer" });
    }
  }
);

// update customer loan status
router.put(
  "/customer/disbursestatus/:customerId",
  authenticateCustomerToken,
  async (req, res) => {
    try {
      const customer = await CustomerModel.findByIdAndUpdate(
        req.params.customerId,
        { disbursementstatus: req.body.disbursementstatus },
        {
          new: true,
        }
      );
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Unable to update customer" });
    }
  }
);

// Delete a customer by ID
router.delete("/customer/:customerId", authenticateToken, async (req, res) => {
  try {
    const customer = await CustomerModel.findByIdAndRemove(
      req.params.customerId
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete customer" });
  }
});

// forget password logic
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await CustomerModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.token = resetToken;
    await user.save();

    const emailConfig = await Settings.findOne({});

    const emailPassword = process.env.EMAIL_PASSWORD;

    const host = emailConfig.smptHost || defaultEmailConfig.smptHost;
    const port = emailConfig.smtpPort || defaultEmailConfig.smtpPort;
    const emailUsername =
      emailConfig.smtpUsername || defaultEmailConfig.smtpUsername;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port == 465 ? true : false,
      auth: {
        user: emailUsername,
        pass: emailPassword,
      },
    });

    const mailOptions = {
      from: `"${emailConfig.fromName || defaultEmailConfig.fromName}" <${
        emailConfig.fromEmail || defaultEmailConfig.fromEmail
      }>`,
      to: email,
      subject: "Boctrust MFB Password Reset",
      text: `Click the following link to reset your password: https://boctrustmfb.com/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Failed to send reset email" });
      }

      res.status(200).json({ message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password Endpoint
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find the user with the provided token
    const customer = await CustomerModel.findOne({ token });

    if (!customer) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the token
    customer.password = hashedPassword;
    customer.token = null; // Clear the token
    await customer.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

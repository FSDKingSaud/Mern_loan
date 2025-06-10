const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const User = require("../models/AdminUser");
const {
  getLoanByCustomerId,
} = require("../services/bankoneOperationsServices");

// configure dotenv
dotenv.config();

router.get("/refreshToken", async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ error: "Unauthorized" });

    const refreshToken = cookies.jwt;

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

    let user = await Customer.findOne({ _id: payload.user_id }).populate({
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
    if (!user) {
      user = await User.findOne({ _id: payload.user_id }).populate("userRole");
    }

    if (!user) {
      return res.status(400).json({ error: "User with Token not found" });
    }

    // Add customer active loan to payload
    if (user?.banking?.isAccountCreated) {
      const customerLoanAccounts = await getLoanByCustomerId(
        user?.banking?.accountDetails.CustomerID
      );

      const activeLoanAccount = customerLoanAccounts.find(
        (account) =>
          account.RealLoanStatus === "Active" && !account.IsLoanWrittenOff
      );

      user = { ...user.toJSON(), activeLoan: activeLoanAccount };
    }

    // Create token
    const token = jwt.sign(
      { user_id: user._id, username: user.username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2m",
      }
    );

    return res.status(200).json({ success: "Request Success", token, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: false });
  res.json({ message: "Cookie cleared" });
});

module.exports = router;

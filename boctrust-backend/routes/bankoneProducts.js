const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer"); // Import customer model
const { default: axios } = require("axios");

const products = [
  {
    Id: 1,
    ProductCode: "100",
    ProductName: "INDIVIDUAL SAVINGS",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 2,
    ProductCode: "101",
    ProductName: "SALARIES SAVINGS",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 3,
    ProductCode: "103",
    ProductName: "SPECIAL TARGET SAVINGS  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 4,
    ProductCode: "104",
    ProductName: "FESTIVE SAVINGS  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 5,
    ProductCode: "105",
    ProductName: "EDUCATION SAVINGS  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 6,
    ProductCode: "106",
    ProductName: "KIDDIES/TRUST SAVINGS  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 7,
    ProductCode: "107",
    ProductName: "THRIFT SAVINGS  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 8,
    ProductCode: "108",
    ProductName: "FASTHIGH EARNINGS SAVINGS  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 9,
    ProductCode: "200",
    ProductName: "INDIVIDUAL CURRENT  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 10,
    ProductCode: "201",
    ProductName: "CORPORATE CURRENT  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 11,
    ProductCode: "202",
    ProductName: "STAFF CURRENT  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 12,
    ProductCode: "203",
    ProductName: "COOP/ASS CURRENT  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 13,
    ProductCode: "204",
    ProductName: "ENTERPRISE CURRENT  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 14,
    ProductCode: "205",
    ProductName: "DIRECTORS CURRENT  ",
    ProductDiscriminator: "SavingsorCurrent",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 15,
    ProductCode: "400",
    ProductName: "FIXED DEPOSIT",
    ProductDiscriminator: "FixedDeposit",
    InterestRate: 4,
    Tenure: 90,
  },
  {
    Id: 16,
    ProductCode: "300",
    ProductName: "INDIVIDUAL  LOAN",
    ProductDiscriminator: "Loan",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 17,
    ProductCode: "301",
    ProductName: "OSUSU LOAN",
    ProductDiscriminator: "Loan",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 18,
    ProductCode: "302",
    ProductName: "QUICK LOAN",
    ProductDiscriminator: "Loan",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 19,
    ProductCode: "303",
    ProductName: "STAFF LOAN",
    ProductDiscriminator: "Loan",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 20,
    ProductCode: "304",
    ProductName: "SALARY LOAN",
    ProductDiscriminator: "Loan",
    InterestRate: 0,
    Tenure: 0,
  },
  {
    Id: 21,
    ProductCode: "305",
    ProductName: "CORPORATE LOAN",
    ProductDiscriminator: "Loan",
    InterestRate: 0,
    Tenure: 0,
  },
];

const baseUrl = process.env.BANKONE_BASE_URL;
const token = process.env.BANKONE_TOKEN;
const mfbcode = "100579";

// Update the creditDbSearch field
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Product/Get/2?authToken=${token}&mfbCode=${mfbcode}`
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to loan Products" });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const productCode = req.params.code;

    const response = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Product/GetByCode/2?authToken=${token}&productCode=${productCode}`
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to loan Products" });
  }
});

module.exports = router; // export router

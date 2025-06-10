const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const CustomerModel = require("../models/Customer"); // Import customer model
const Loan = require("../models/Loan");
// configure dotenv
dotenv.config();

// Read all customer
const baseUrl = process.env.BASE_URL;

// Get Customer and His Loan with KYC
router.get("/", async (req, res) => {
  try {
    const { search, dateFilter, sort = "latest" } = req.query;

    let queryObject = {};

    if (search) {
      const stringSearchFields = ["firstname", "lastname", "username", "email"];

      const query = {
        $or: [
          ...stringSearchFields.map((field) => ({
            [field]: new RegExp("^" + search, "i"),
          })),
        ],
      };
      queryObject = { ...queryObject, ...query };
    }

    if (dateFilter) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const query = {
        createdAt: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
      };
      queryObject = { ...queryObject, ...query };
    }

    // let customerCollection = CustomerModel.find(queryObject)
    //   .sort(
    //     sort === "latest" ? { "kyc.timestamps": -1 } : { "kyc.timestamps": 1 }
    //   )
    //   .populate("employer");

    // let customers = await customerCollection;

    let customerCollection = CustomerModel.aggregate([
      { $match: queryObject },
      {
        $lookup: {
          from: "employers",
          localField: "employer",
          foreignField: "_id",
          as: "employer",
        },
      },
      {
        $unwind: {
          path: "$employer",
          preserveNullAndEmptyArrays: true, // Ensures customers without an employer are included
        },
      },
      { $sort: { "kyc.timestamps": sort === "latest" ? -1 : 1 } },
    ]);
    let customers = await customerCollection.exec();

    const customerIds = customers.map((customer) => customer._id);

    let customersAndLoans = await Loan.find({
      customer: { $in: customerIds },
    });

    let result = customers.map((customer) => {
      const loan = customersAndLoans.find(
        (loan) => loan.customer.toString() === customer._id.toString()
      );

      return {
        ...customer,
        loan: loan
          ? {
              ...loan.toJSON(),
            }
          : null,
      };
    });

    result = result.map((customer) => {
      return {
        ...customer,
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

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to fetch customer" });
  }
});

module.exports = router;

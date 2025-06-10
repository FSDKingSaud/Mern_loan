const express = require("express");
const LoanDisbursement = require("../models/LoanDisbursment");
const LoanRepayment = require("../models/LoanRepayment");
const RemitaCollection = require("../models/RemitaCollection");
const BankoneCollection = require("../models/BankoneCollection");
const router = express.Router();

router.get("/disbursements", async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Yesterday
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(endOfToday);
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);

    // This Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Last Month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfThisMonth = new Date(startOfMonth); // Same as startOfMonth

    // Fetch records from the database
    const [todayRecords, yesterdayRecords, thisMonthRecords, lastMonthRecords] =
      await Promise.all([
        LoanDisbursement.find({
          createdAt: { $gte: startOfToday, $lt: endOfToday },
        }),
        LoanDisbursement.find({
          createdAt: { $gte: startOfYesterday, $lt: endOfYesterday },
        }),
        LoanDisbursement.find({
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        }),
        LoanDisbursement.find({
          createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        }),
      ]);

    res.json({
      success: true,
      data: {
        today: todayRecords.length,
        yesterday: yesterdayRecords.length,
        thisMonth: thisMonthRecords.length,
        lastMonth: lastMonthRecords.length,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Error Fetching Disbursmemt Analytics" });
  }
});

router.get("/collections", async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Yesterday
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(endOfToday);
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);

    // This Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Last Month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfThisMonth = new Date(startOfMonth); // Same as startOfMonth

    // Fetch records from the database
    const [todayRecords, yesterdayRecords, thisMonthRecords, lastMonthRecords] =
      await Promise.all([
        LoanRepayment.find({
          createdAt: { $gte: startOfToday, $lt: endOfToday },
        }),
        LoanRepayment.find({
          createdAt: { $gte: startOfYesterday, $lt: endOfYesterday },
        }),
        LoanRepayment.find({
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        }),
        LoanRepayment.find({
          createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        }),
      ]);

    res.json({
      success: true,
      data: {
        today: todayRecords.length,
        yesterday: yesterdayRecords.length,
        thisMonth: thisMonthRecords.length,
        lastMonth: lastMonthRecords.length,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Error Fetching Disbursmemt Analytics" });
  }
});



router.get("/monthlyCollectionRepayment", async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1st

    // Fetch collections and disbursements from the start of the year
    const [collections, disbursement] = await Promise.all([
      LoanRepayment.find({ createdAt: { $gte: startOfYear } }),
      LoanDisbursement.find({ createdAt: { $gte: startOfYear } }),
    ]);

    // Function to group data by Month-Year
    const groupByMonthForDisbursement = (data, type) => {
      return data.reduce((acc, item) => {
        const date = new Date(item.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM

        if (!acc[key]) acc[key] = { month: key, collections: 0, disbursement: 0 };
        acc[key][type] += item.amount || 0; // Ensure amount exists

        return acc;
      }, {});
    };

    // Function to group data by Month-Year (with async calls)
    const groupByMonthForCollection = async (data, type) => {
      const groupedData = {};

      await Promise.all(
        data.map(async (item) => {
          const date = new Date(item.createdAt);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM

          let collectionDetails;
          if (item.collectionType === "RemitaCollection") {
            collectionDetails = await RemitaCollection.findById(item.collectionRef);
          } else {
            collectionDetails = await BankoneCollection.findById(item.collectionRef);
          }

          if (!groupedData[key]) {
            groupedData[key] = { month: key, collections: 0, disbursement: 0 };
          }

          groupedData[key][type] += collectionDetails?.amount || 0; // Ensure amount exists
        })
      );

      return groupedData;
    };

    // Await the collections grouped data
    const collectionsGrouped = await groupByMonthForCollection(collections, "collections");
    const disbursementGrouped = groupByMonthForDisbursement(disbursement, "disbursement");

    // Merge collections and disbursement into one dataset
    const mergedData = { ...collectionsGrouped };

    for (const key in disbursementGrouped) {
      if (!mergedData[key]) {
        mergedData[key] = { month: key, collections: 0, disbursement: disbursementGrouped[key].disbursement };
      } else {
        mergedData[key].disbursement = disbursementGrouped[key].disbursement;
      }
    }

    // Convert to sorted array (for chart plotting)
    const result = Object.values(mergedData).sort(
      (a, b) => new Date(`${a.month}-01`) - new Date(`${b.month}-01`)
    );

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
});


module.exports = router;

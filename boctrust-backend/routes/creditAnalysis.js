const express = require("express");
const router = express.Router();
const CreditAnalysis = require("../models/CreditAnalysis"); // Import creditAnalysis model
const multer = require("multer");
const path = require("path");
const Loan = require("../models/Loan");
const { getUserRole } = require("../utils/getUserRole");
const Customer = require("../models/Customer");
const mongoose = require("mongoose");

const baseUrl = process.env.BASE_URL;

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
  { name: "dbSearchReport" },
  { name: "deductSearchReport" },
  { name: "bureauSearchReport" },
  { name: "uploadPaySlip" },
]);

router.get("/", async (req, res) => {
  try {
    const userRole = await getUserRole(req.user);

    const { search, dateFilter, sort = "latest" } = req.query;

    let customerIds = [];

    if (search) {
      const stringSearchFields = ["firstname", "lastname", "username", "email"];
      customerIds = await Customer.find({
        $or: stringSearchFields.map((field) => ({
          [field]: new RegExp("^" + search, "i"),
        })),
      }).select("_id");
    }

    let queryObject = {
      ...(customerIds.length > 0 && {
        customer: { $in: customerIds.map((c) => c._id) },
      }),
    };

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

    if (userRole.value === "credit_analyst") {
      const creditAnalysis = await CreditAnalysis.find({
        $or: [
          { "assignment.creditAnalyst": req.user._id },
          { "assignment.isCreditAnalystAssigned": false },
        ],
        ...queryObject,
      })
        .sort({ createdAt: sort === "latest" ? -1 : 1 })
        .populate("loan")
        .populate({
          path: "customer",
          populate: {
            path: "employer", // Populating employer within customer
            model: "Employer",
          },
        })
        .populate("assignment.creditAnalyst");
      return res.json(creditAnalysis);
    } else {
      const creditAnalysis = await CreditAnalysis.find(queryObject)
        .sort({ createdAt: sort === "latest" ? -1 : 1 })
        .populate("loan")
        .populate({
          path: "customer",
          populate: {
            path: "employer", // Populating employer within customer
            model: "Employer",
          },
        })
        .populate("assignment.creditAnalyst");
      return res.json(creditAnalysis);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err?.message ?? "Something Went Wrong" });
  }
});

router.get("/:analysisId", async (req, res) => {
  try {
    const creditAnalysis = await CreditAnalysis.findOne({
      _id: req.params.analysisId,
    })
      .populate("loan")
      .populate({
        path: "customer",
        populate: {
          path: "employer", // Populating employer within customer
          model: "Employer",
        },
      })
      .populate("assignment.creditAnalyst");
    return res.json(creditAnalysis);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err?.message ?? "Something Went Wrong" });
  }
});

// Update the creditDbSearch field
router.put("/creditDbSearch/:analysisId", multipleUpload, async (req, res) => {
  if (req.files?.dbSearchReport) {
    req.body.dbSearchReport = `${baseUrl}/public/filesUpload/${req.files.dbSearchReport[0].filename}`;
  }

  try {
    const analysisId = req.params.analysisId;
    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`creditDbSearch.${key}`] = updates[key];
      return acc;
    }, {});

    // send the updated data in the request body
    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      {
        $set: updateObject,
        $currentDate: { "creditDbSearch.updatedAt": true },
      },
      { new: true }
    );

    res.json(creditAnalysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update creditDbSearch" });
  }
});

// Update the deductcheck field
router.put("/deductcheck/:analysisId", multipleUpload, async (req, res) => {
  if (req.files?.deductSearchReport) {
    req.body.deductSearchReport = `${baseUrl}/public/filesUpload/${req.files.deductSearchReport[0].filename}`;
  }

  try {
    const analysisId = req.params.analysisId;

    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`deductCheck.${key}`] = updates[key];
      return acc;
    }, {});

    // send the updated data in the request body
    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      {
        $set: updateObject,
        $currentDate: { "deductCheck.updatedAt": true },
      },
      { new: true }
    );

    res.json(creditAnalysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update deductcheck" });
  }
});

// Update the creditBureauSearch field
router.put(
  "/creditBureauSearch/:analysisId",
  multipleUpload,
  async (req, res) => {
    try {
      const analysisId = req.params.analysisId;

      const updates = req.body;

      // send the updated data in the request body
      const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
        analysisId,
        {
          $push: {
            creditBureauSearch: updates,
          },
        },
        { new: true }
      );

      res.json(creditAnalysis);
    } catch (err) {
      console.error(err);

      res.status(500).json({ error: "Failed to update creditBureauSearch" });
    }
  }
);
// Update the creditBureauSearch field
router.put(
  "/creditBureauSearch/:analysisId/fileupload",
  multipleUpload,
  async (req, res) => {
    try {
      const analysisId = req.params.analysisId;

      const { bureauName, reportType, reportReason } = req.body;
      
      console.log(req.files, "(req.files")
      
      if (req.files?.bureauSearchReport) {
        req.body.bureauSearchReport = `${baseUrl}/public/filesUpload/${req.files.bureauSearchReport[0].filename}`;
      } else {
        return res.status(400).json({
          error: "Please Upload A file",
        });
      }

      // Find the document
      const creditAnalysis = await CreditAnalysis.findById(analysisId);
      if (!creditAnalysis) {
        return res.status(404).send("CreditAnalysis not found");
      }

      // Find the specific element in the array
      const creditBureauSearch = creditAnalysis.creditBureauSearch;

      const element = creditBureauSearch.find(
        (item) =>
          item.bureauName === bureauName &&
          item.reportType === reportType &&
          item.reportReason === reportReason
      );

      if (!element) {
        return res.status(400).json({
          error:
            "No Bureau Search History. Please Provide Report for Search Carried Out",
        });
      }

      // Update the specific element
      element.bureauSearchReport = req.body.bureauSearchReport;

      // Save the document
      await creditAnalysis.save();

      res.json(creditAnalysis);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update creditBureauSearch" });
    }
  }
);

// Update the paySlipAnalysis field
router.put("/paySlipAnalysis/:analysisId", multipleUpload, async (req, res) => {
  try {
    const analysisId = req.params.analysisId;
    if (!analysisId) {
			throw new Error("AnalysisId not found");
		}

		if (!mongoose.Types.ObjectId.isValid(analysisId)) {
			throw new Error("Invalid AnalysisId");
		}


    if (req.files?.uploadPaySlip) {
      req.body.uploadPaySlip = `${baseUrl}/public/filesUpload/${req.files.uploadPaySlip[0].filename}`;
    }
    if (req.body?.extraLenders) {
      req.body.extraLenders = JSON.parse(req.body.extraLenders);
    }

    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`paySlipAnalysis.${key}`] = updates[key];
      return acc;
    }, {});

    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      {
        $set: updateObject,
        $currentDate: { "paySlipAnalysis.updatedAt": true },
      },
      { new: true }
    );
    res.json(creditAnalysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to update paySlipAnalysis", error: err.message });
	// res.status(500).json({ error: "Failed to update paySlipAnalysis", err: err.message });
  }
});

// Update the paySlipAnalysis field
router.put("/activate-buyover/:analysisId", async (req, res) => {
  try {
    const analysisId = req.params.analysisId;

    const customerValid = await CreditAnalysis.findOne({ _id: analysisId });
    if (customerValid.buyoverloan != "yes") {
      return res
        .status(400)
        .json({ error: "CreditAnalysis Did not request for a BuyOver Loan" });
    }

    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      { buyoverloanactivated: true },
      { new: true }
    );
    res.json(creditAnalysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update paySlipAnalysis" });
  }
});

// Update the decisionSummary field
router.put("/decisionSummary/:analysisId", async (req, res) => {
  try {
    const analysisId = req.params.analysisId;
    const updates = req.body;
    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      { decisionSummary: updates },
      { new: true }
    );
    res.json(creditAnalysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update decisionSummary" });
  }
});

// Update the assign to credit analyst
router.put("/assignto/:analysisId", async (req, res) => {
  try {
    const analysisId = req.params.analysisId;

    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      {
        $set: {
          "assignment.creditAnalyst": req.user._id,
          "assignment.isCreditAnalystAssigned": true,
        },
        $currentDate: { "assignment.updatedAt": true },
      },
      { new: true }
    );
    res.json(creditAnalysis);
  } catch (err) {
    res.status(500).json({ error: "Failed to Assign CreditAnalysis" });
  }
});

// Update the Approved CreditAnalysis Loan by Credit Officer
router.put("/approve/co/:analysisId", async (req, res) => {
  try {
    const analysisId = req.params.analysisId;
    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`decisionSummary.${key}`] = updates[key];
      return acc;
    }, {});

    // Update the Approval Status
    updateObject["decisionSummary.creditOfficerApprovalStatus"] = "approved";

    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      {
        $set: updateObject,
        $currentDate: {
          "decisionSummary.creditOfficerApprovedAt": true,
        },
      },
      { new: true }
    );
    res.json(creditAnalysis);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed Credit Officer Approval" });
  }
});

// Update the Approved CreditAnalysis Loan by Head of Credit
router.put("/approve/hoc/:analysisId", async (req, res) => {
  try {
    const analysisId = req.params.analysisId;

    const updateObject = {};

    //Update the Approval Status
    updateObject["decisionSummary.headOfCreditApprovalStatus"] = "approved";

    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      {
        $set: updateObject,
      },
      { new: true }
    );

    if (!creditAnalysis) {
      return res.status(404).json({ error: "CreditAnalysis Not Found" });
    }

    // Update the Loan Status
    await Loan.findOneAndUpdate(
      {
        _id: creditAnalysis.loan,
      },
      {
        loanstatus: "with coo",
      }
    );

    res.json(creditAnalysis);
  } catch (err) {
    res.status(500).json({ error: "Failed to Head of Credit Approval" });
  }
});

// Update the Approved CreditAnalysis Loan by Chief Operations Officer
router.put("/approve/coo/:analysisId", async (req, res) => {
  try {
    const analysisId = req.params.analysisId;

    const updateObject = {};

    //Update the Approval Status
    updateObject["decisionSummary.cooApprovalStatus"] = "approved";

    const creditAnalysis = await CreditAnalysis.findByIdAndUpdate(
      analysisId,
      {
        $set: updateObject,
      },
      { new: true }
    );

    if (!creditAnalysis) {
      return res.status(404).json({ error: "CreditAnalysis Not Found" });
    }

    // Update the Loan Status
    await Loan.findOneAndUpdate(
      {
        _id: creditAnalysis.loan,
      },
      {
        loanstatus: "unbooked",
      }
    );

    res.json(creditAnalysis);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to Approve by COO" });
  }
});

router.post("/", async (req, res) => {
  try {
    await CreditAnalysis.create(req.body);
    res.json({ message: "Added Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Add " });
  }
});

module.exports = router;

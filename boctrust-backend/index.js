// include dependency
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const blogRoutes = require("./routes/blog");
const wikiRoutes = require("./routes/wiki");
const productRoutes = require("./routes/product");
const inquiryRoutes = require("./routes/inquiry");
const contactRoutes = require("./routes/contactForm");
const branchRoutes = require("./routes/branches");
const roleRoute = require("./routes/role");
const loanRoute = require("./routes/loan");
const customersLoansRoute = require("./routes/customerLoans");
const customerRoutes = require("./routes/customer");
const creditAnalysisRoute = require("./routes/creditAnalysis");
const customerUpdateRoute = require("./routes/customerUpdate");
const accountRoutes = require("./routes/account");
const disbursementRoutes = require("./routes/disbursementMethod");
const adminRoutes = require("./routes/adminUser");
const analyticsRouter = require("./routes/analytics");
const bankoneAccountOfficers = require("./routes/bankoneAccountOfficers");
const employersManagerRoutes = require("./routes/employersManager");
const mandateRuleRoutes = require("./routes/mandateRule");
const statementRuleRoutes = require("./routes/statementRule");
const employerLetterRuleRoutes = require("./routes/employmentLetterRule");
// bankone operation routes
const bankOneOperationRoutes = require("./routes/bankingOperation");
const bankOneProductsRoutes = require("./routes/bankoneProducts");
// remita operation routes
const remitaOperationRoutes = require("./routes/remitaOperation");
const sendEmail = require("./routes/emailSender");
// crc register routes
const crcRegisterRoutes = require("./routes/crcRegister");
// credit registry route
const creditRegistryRoutes = require("./routes/creditRegistry");
// first central routes
const firstCentralRoutes = require("./routes/firstCentral");
const tempDataRoutes = require("./routes/tempData");
const bvnVerificationRoutes = require("./routes/bvnVerification");
const career = require("./routes/career");
const settings = require("./routes/settings");
const siteContent = require("./routes/siteContentRoute");
const boardMemberRoutes = require("./routes/boardMember");
// board members seeds
const BoardMember = require("./models/BoardOfDirectors");
const boardMembers = require("./seedData/boardMembers");
const jobApplicationRoutes = require("./routes/jobApplication");

// front page products
const productsFrontPage = require("./routes/productsFrontPage");
const productsSeedData = require("./seedData/productsFrontPageData");
const ProductsFrontPage = require("./models/ProductsFrontPage");

// otp
const termiiOTPRoute = require("./routes/termii");

// refresh token
const refreshTokenRoutes = require("./routes/refreshToken");

// nibss direct debit
const directDebitRoutes = require("./routes/directDebitOperation");

// Google analytics
const googleAnalytics = require("./routes/googleAnalytics");

// consent cookie
const consentCookie = require("./routes/consentCookies");

// consent cookie
const nibbs = require("./routes/nibss");
const notification = require("./routes/notification");

//top-up route
const topupLoanRoute = require("./routes/topupLoanRoute");

// top-up eligibility
const cron = require("node-cron");
const updateMonthsSinceLastLoan = require("./cronworkers/updateMonthSinceLastLoan");
require("./cronworkers/nibssCron");
require("./cronworkers/topUpCron");
require("./cronworkers/overdueloansCron");

const { initializeSocket } = require("./utils/socketIo");

const {
  authenticateToken,
  authenticateStaffToken,
} = require("./middleware/auth");

// configure dotenv
dotenv.config();

// connect to database
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database successfully");

    // seed board members data
    BoardMember.find()
      .then((boardMembersData) => {
        if (boardMembersData.length === 0) {
          BoardMember.insertMany(boardMembers)
            .then(() => console.log("Board members data seeded successfully"))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    // seed product page data
    ProductsFrontPage.find()
      .then((productsData) => {
        if (productsData.length === 0) {
          ProductsFrontPage.insertMany(productsSeedData)
            .then(() => console.log("Product page data seeded successfully"))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    // Schedule the cron worker job to run at midnight daily
    cron.schedule("0 0 * * *", async () => {
      console.log("Running daily top-up eligibility update...");
      await updateTopUpEligibility();
    });

    // Schedule the job to run daily at midnight
    cron.schedule("0 0 * * *", async () => {
      console.log("Running monthly update for monthsSinceLastLoan...");
      await updateMonthsSinceLastLoan();
    });

    // create new instance of express
    const app = express();

    // use cors
    const corsOptions = {
      origin: ["http://localhost:5173", "http://172.20.10.3:5173", "https://www.boctrustmfb.com"],
      methods: "GET, PUT, POST, DELETE",
      credentials: true,
    };

    app.use(cors(corsOptions));

    app.use(cookieParser());

    // use express json
    app.use(express.json());

    // Serve static files from the "uploads" directory
    app.use("/uploads", express.static("uploads"));

    // Serve static files from the "public/filesUpload" directory
    app.use("/public/filesUpload", express.static("public/filesUpload"));

    // Middleware
    // Increase the payload limit
    // express.urlencoded()
    app.use(bodyParser.json({ limit: "50mb" }));
    // app.use(bodyParser.urlencoded({ extended: true }));

    // use routes
    app.use("/api/blog", blogRoutes);
    app.use("/api/wiki", wikiRoutes);
    app.use("/api/product", productRoutes);
    app.use("/api/inquiry", inquiryRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/branch", branchRoutes);
    app.use("/api/customer", customerRoutes);
    app.use("/api/customers-loans", customersLoansRoute);
    app.use("/api/role", authenticateStaffToken, roleRoute);
    app.use("/api/loans", authenticateToken, loanRoute);
    app.use("/api/updatecustomer", customerUpdateRoute);
    app.use(
      "/api/credit-analysis",
      authenticateStaffToken,
      creditAnalysisRoute
    );
    app.use("/api/account", accountRoutes);
    app.use("/api/disbursement", authenticateStaffToken, disbursementRoutes);
    app.use("/api/agency", employersManagerRoutes);
    app.use("/api/mandate-rule", authenticateStaffToken, mandateRuleRoutes);
    app.use("/api/statement-rule", authenticateStaffToken, statementRuleRoutes);
    app.use(
      "/api/employer-letter-rule",
      authenticateStaffToken,
      employerLetterRuleRoutes
    );
    // admin routes
    app.use("/api/admin", adminRoutes);
    app.use("/api/analytics", authenticateStaffToken, analyticsRouter);
    app.use("/api/account-officers", bankoneAccountOfficers);
    // bankone operation routes
    app.use("/api/bankone", bankOneOperationRoutes);
    app.use("/api/bankone-products", bankOneProductsRoutes);
    // remita operation routes
    app.use("/api/remita", remitaOperationRoutes);
    // email sender routes
    app.use("/api/email", sendEmail);
    // crc register routes
    app.use("/api/crc", authenticateStaffToken, crcRegisterRoutes);
    // credit registry routes
    app.use(
      "/api/creditregistry",
      authenticateStaffToken,
      creditRegistryRoutes
    );
    // first central routes
    app.use("/api/firstcentral", authenticateStaffToken, firstCentralRoutes);

    // temp data routes
    app.use("/api/tempdata", tempDataRoutes);

    // bvn verification routes
    app.use("/api/bvn", bvnVerificationRoutes);

    // career routes
    app.use("/api/career", career);
    app.use("/api/job-application", jobApplicationRoutes);

    // settings routes
    app.use("/api/settings", settings);

    // site content routes
    app.use("/api/site-content", siteContent);

    // board member routes
    app.use("/api/board-member", boardMemberRoutes);

    // front page products
    app.use("/api/products-front-page", productsFrontPage);
    app.use("/api/otp", termiiOTPRoute);
    app.use("/api/sharedAuth", refreshTokenRoutes);

    // nibss direct debit
    app.use("/api/direct-debit",  directDebitRoutes);

    // top-up loan route
    app.use("/api/top-up", authenticateToken, topupLoanRoute);

    // Google analytics
    app.use("/api/google", googleAnalytics);
    app.use("/api/consent-cookie", consentCookie);

    // nibss
    app.use("/api/nibss", authenticateStaffToken, nibbs);
    app.use("/api/notification", authenticateToken, notification);

    const server = http.createServer(app);
    initializeSocket(server);

    server.listen(process.env.PORT || 3030, "0.0.0.0", () =>
      console.log("Server running on port 3030")
    );
  })
  .catch((err) => console.log(err));

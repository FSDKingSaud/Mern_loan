const express = require("express");
const { google } = require("googleapis");

const router = express.Router();


// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  "YOUR_CLIENT_ID",
  "YOUR_CLIENT_SECRET",
  "YOUR_REDIRECT_URI"
);

// Get Analytics data
router.get("/analytics-data", async (req, res) => {
  try {
    oauth2Client.setCredentials({
      access_token: "YOUR_ACCESS_TOKEN",
    });

    const analytics = google.analyticsreporting({
      version: "v4",
      auth: oauth2Client,
    });

    const response = await analytics.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: "YOUR_VIEW_ID",
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [{ expression: "ga:sessions" }, { expression: "ga:pageviews" }],
            dimensions: [{ name: "ga:pagePath" }],
          },
        ],
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// export router
module.exports = router;

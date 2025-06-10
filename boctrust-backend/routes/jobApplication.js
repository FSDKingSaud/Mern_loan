const express = require("express");
const multer = require("multer");
const path = require("path");
const JobApplication = require("../models/JobApplication");
const Career = require("../models/Career");
const {
  getUsersToSendNotificationFromTarget,
  saveAndSendNotification,
} = require("../services/notification.service");
const {
  sendJobApplicationNotification,
} = require("../services/jobApplication.service");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// apply for a job
router.post("/apply", upload.single("resume"), async (req, res) => {
  const { name, email, phone, coverLetter, vacancy } = req.body;
  const resume = req.file;

  try {
    if (!resume) {
      return res.status(400).send("Resume is required");
    }
    const newApplication = new JobApplication({
      vacancy,
      name,
      email,
      phone,
      coverLetter,
      resumePath: resume.path,
      vacancy: JSON.parse(vacancy),
    });

    await newApplication.save();

    await sendJobApplicationNotification({
      name,
      email,
      vacancy: JSON.parse(vacancy),
    });

    res.status(201).send("Application submitted successfully!");
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).send("There was an error submitting the application");
  }
});

// Endpoint to fetch all job applications, sorted by latest application
router.get("/applications", async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).send("There was an error fetching the applications");
  }
});

// Endpoint to delete a job application
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await JobApplication.findByIdAndDelete(id);
    res.status(200).send("Application deleted successfully");
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).send("There was an error deleting the application");
  }
});

module.exports = router;

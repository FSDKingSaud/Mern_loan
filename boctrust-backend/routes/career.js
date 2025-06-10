const express = require("express");
const router = express.Router();
const Career = require("../models/Career"); // import Career model
const { upload } = require("../utils/multer");
const {
  handleCareerPaginationSearchSortFilter,
} = require("../services/career.service");

// career API Endpoints
// get all career posts endpoint
router.get("/careers", async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL;

    const careers = await Career.find();

    const careersWithImages = careers.map((career) => {
      return {
        ...career.toJSON(),
        imageUrl: `${baseUrl}/uploads/${career.image}`,
      };
    });
    // return success response
    return res.status(200).json({ careersWithImages });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/all-careers", async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL;
    const { sortOptions, filter, pageNumber, pageSize, skip } =
      handleCareerPaginationSearchSortFilter(req.query);

    const careers = await Career.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const totalCareers = await Career.countDocuments(filter);
    const totalPages = Math.ceil(totalCareers / pageSize);

    const careersWithImages = careers.map((career) => {
      return {
        ...career.toJSON(),
        imageUrl: `${baseUrl}/uploads/${career.image}`,
      };
    });
    // return success response
    return res
      .status(200)
      .json({
        data: careersWithImages,
        totalCareers,
        page: pageNumber,
        totalPages,
        limit: pageSize,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const type = upload.single("image");

// create new career post endpoint
router.post("/careers", type, async (req, res) => {
  try {
    // Get post data from request body
    const { jobtitle, description, deadline, dateposted } = req.body;
    const image = req.file.filename;

    // Validate required fields
    if (!jobtitle || !description || !deadline || !dateposted || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new career
    const career = new Career({
      jobtitle,
      description,
      deadline,
      dateposted,
      image,
    });

    // Save career
    await career.save();

    // Return success response
    return res.status(201).json({ success: "career created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single career endpoint
router.put("/careers/:id", async (req, res) => {
  try {
    // get career id from request params
    const { id } = req.params;
    // get career data from request body
    const { jobtitle, description, deadline, dateposted, image } = req.body;

    // Validate required fields
    if (!jobtitle || !description || !deadline || !dateposted || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // find career by id and update
    const career = await Career.findByIdAndUpdate(id, {
      jobtitle,
      description,
      deadline,
      dateposted,
      image,
    });

    // save updated career
    career.save();
    // return success response
    return res.status(200).json({ success: "career updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete single career endpoint
router.delete("/careers/:id", async (req, res) => {
  try {
    // get career id from request params
    const { id } = req.params;
    // find career by id and delete
    await Career.findByIdAndDelete(id);
    // return success response
    return res.status(200).json({ success: "career deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// export router
module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Disbursement = require('../models/DisbursementMethod');

const baseUrl = process.env.BASE_URL;

// Set up Multer storage to define where to save the uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file with a unique name
  },
});

const upload = multer({
  storage: storage,
});


router.get('/disbursements', async (req, res) => {
    try {
        // Get all disbursements
        const disbursements = await Disbursement.find();

        // Map disbursements to include image URLs
        const disbursementsWithImages = disbursements.map(disbursement => {
            return {
                ...disbursement.toJSON(),
                imageUrl: `${baseUrl}/uploads/${disbursement.logoImg}`
            };
        });

        // Return success response with disbursements and image URLs
        return res.status(200).json({ disbursements: disbursementsWithImages });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// create new disbursement method endpoint
const type = upload.single('logo');

router.post('/disbursements', type, async (req, res) => {
  try {
    // Get data from request body
    const { methodName } = req.body;

    // Get the image file name from req.file
    const logoImg = req.file.filename;
 
    // Validate required fields
      if (!methodName || !logoImg) {
      return res.status(400).json({ error: 'All fields are required' });
      }

    // Create new disbursement method
    const disbursement = new Disbursement({ methodName, logoImg });

    // Save disbursement
    await disbursement.save();

    // Return success response
    return res.status(201).json({ success: 'disbursement created successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single disbursement endpoint
router.put('/disbursements/:id', async (req, res) => {
    try {
        // get disbursement id from request params
      const { id } = req.params;

        // get disbursement update data from request body 
        const { methodName, logoImg } = req.body;

        // validate required fields
        if (!methodName || !logoImg) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // find disbursement by id and update
        const disbursement = await Disbursement.findByIdAndUpdate(id, { methodName, logo }, { new: true });
        
        // // save updated disbursement
        // disbursement.save();

        // return success response
        return res.status(200).json({ success: 'disbursement updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// delete single disbursement endpoint
router.delete('/disbursements/:id', async (req, res) => {
    try {
        // get disbursement method id from request params
        const { id } = req.params;

        // find post by id and delete
        await Disbursement.findByIdAndDelete(id);
        // return success response
        return res.status(200).json({ success: 'disbursement deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// export router
module.exports = router;
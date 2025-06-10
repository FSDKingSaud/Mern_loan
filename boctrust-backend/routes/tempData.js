const express = require('express');
const router = express.Router();
const TempData = require('../models/TempData'); // import TempData model

// create data
router.post('/tempdata', async (req, res) => {
    try {
        // Get post data from request body
        const { bvn, careerType, loanProduct, loanAmount, numberOfMonths, loanTotalRepayment, monthlyRepayment } = req.body;

        // Validate required fields
        if (!bvn || !careerType || !loanProduct || !loanAmount || !numberOfMonths || !loanTotalRepayment || !monthlyRepayment) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create new TempData
        const tempData = new TempData({ bvn, careerType, loanProduct, loanAmount, numberOfMonths, loanTotalRepayment, monthlyRepayment });

        // Save TempData
        tempData.save();

        // Return success response
        return res.status(201).json({ success: 'Data created successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// get single record using bvn
router.get('/tempdata/:bvn', async (req, res) => {
    try {
        // Get bvn from request params
        const { bvn } = req.params;

        // Validate required fields
        if (!bvn) {
            return res.status(400).json({ error: 'BVN is required' });
        }

        // Get TempData
        const tempData = await TempData.findOne({ bvn });

        if (!tempData) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Return success response
        return res.status(200).json({ success: 'Data retrieved successfully', data: tempData });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// delete record using bvn
router.delete('/tempdata/:bvn', async (req, res) => {
    try {
        // Get bvn from request params
        const { bvn } = req.params;

        // Validate required fields
        if (!bvn) {
            return res.status(400).json({ error: 'BVN is required' });
        }

        // Delete TempData
        await TempData.findOneAndDelete({ bvn });

        // Return success response
        return res.status(200).json({ success: 'Data deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// export 
module.exports = router;

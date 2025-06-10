// Admin Boctrust Account Management System
const express = require('express');
const router = express.Router();
const Account = require('../models/Account'); // import account model

// Account API Endpoints
// get all account endpoint
router.get('/accounts', async (req, res) => {
  try {
    const accounts = await Account.find();
    // return success response
    return res.status(200).json({ accounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// create new account endpoint
router.post('/accounts', (req, res) => {

  try {
    // Get account data from request body
    const { accountName, interestRate, interestMethod, interestPeriod} = req.body;

    // Validate required fields
    if (!accountName || !interestRate || !interestMethod || !interestPeriod) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new account
    const account = new Account({ accountName, interestRate, interestMethod, interestPeriod});

    // Save account
    account.save();

    // Return success response
    return res.status(201).json({ success: 'Account created successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single account endpoint
router.put('/accounts/:id', async (req, res) => {
  try {
    // get account id from request params
      const { id } = req.params;
      
    // get account data from request body
      const { accountName, interestRate, interestMethod, interestPeriod } = req.body;
      
    // validate required fields
    if (!accountName || !interestRate || !interestMethod || !interestPeriod) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // find account by id and update
    const account = await Account.findByIdAndUpdate(id, { accountName, interestRate, interestMethod, interestPeriod });
    
    // save updated account
      account.save();
      
    // return success response
    return res.status(200).json({ success: 'account updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete single account endpoint
router.delete('/accounts/:id', async (req, res) => {
  try {
    // get account id from request params
    const { id } = req.params;
    // find account by id and delete
      
      await Account.findByIdAndDelete(id);
      
    // return success response
    return res.status(200).json({ success: 'Account deleted successfully' });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// export router
module.exports = router;
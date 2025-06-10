const express = require('express');
const router = express.Router();
const Contact = require('../models/ContactForm'); // import contact model

// Contact API Endpoints
// get all contact endpoint
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    // return success response
    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// create new contact endpoint
router.post('/contacts', async (req, res) => {
  try {
    // Get post data from request body
    const { fullName, phoneNumber, email, subject, message } = req.body;

    // Validate required fields
      if (!fullName || !phoneNumber || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new contact
      const contact = new Contact({ fullName, phoneNumber, email, subject, message });

    // Save contact
      await contact.save();
    // Return success response
    return res.status(201).json({ success: 'Contact created successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// delete single contact endpoint
router.delete('/contacts/:id', async (req, res) => {
  try {
    // get contact id from request params
    const { id } = req.params;
    // find contact by id and delete
    await Contact.findByIdAndDelete(id);
    // return success response
    return res.status(200).json({ success: 'contact deleted successfully' });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// export router
module.exports = router;
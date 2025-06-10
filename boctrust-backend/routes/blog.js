const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/Post'); // import post model
const { authenticateStaffToken } = require('../middleware/auth');

// Set up Multer storage to define where to save the uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file with a unique name
  },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage: storage });

// blog post api endpoints
// get all blog posts endpoint
router.get('/posts', async (req, res) => {
    try {
        // get all posts
      const posts = await Post.find().sort({ createdAt: -1 });
      
      // blogs with images
      const postsWithImages = posts.map(post => {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3030';
        return {
          ...post.toJSON(),
          imageUrl: `${baseUrl}/uploads/${post.image}`
        };
      });


        // return success response
        return res.status(200).json({ posts: postsWithImages});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// create new blog post endpoint
router.post('/posts', authenticateStaffToken, upload.single('postImg'), async (req, res) => {
  try {
    // Get post data from request body
    const { title, postSummary, body, category, tags } = req.body;

    // Get the image file name from req.file
    const image = req.file.filename;

    // Validate required fields
    if (!title || !postSummary || !body || !category || !tags || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new post
    const post = new Post({ title, postSummary, body, category, tags, image });

    // Save post
    await post.save();

    // Return success response
    return res.status(201).json({ success: 'Post created successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single blog post endpoint
router.put('/posts/:id', authenticateStaffToken, async (req, res) => {
    try {
        // get post id from request params
      const { id } = req.params;
        // get post data from request body 
        const { title, postSummary, body, category, tags } = req.body;
        // validate required fields
        if (!title || !postSummary || !body || !category || !tags ) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // find post by id and update
        const post = await Post.findByIdAndUpdate(id, { title, postSummary, body, category, tags   });
        // save updated post
        post.save();
        // return success response
        return res.status(200).json({ success: 'Post updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// delete single blog post endpoint
router.delete('/posts/:id', authenticateStaffToken, async (req, res) => {
    try {
        // get post id from request params
      const { id } = req.params;
      
        // find post by id and delete
      await Post.findByIdAndDelete(id);
      
        // return success response
      return res.status(200).json({ success: 'Post deleted successfully' });
      
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// export router
module.exports = router;
const express = require('express');
const router = express.Router();
const ProductsFrontPage = require('../models/ProductsFrontPage');

// Fetch all products
router.get('/fetch-all', async (req, res) => {
  try {
    const products = await ProductsFrontPage.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch a single ProductsFrontPage by ID
router.get('/fetch-one/:id', async (req, res) => {
  try {
    const product = await ProductsFrontPage.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product by ID
router.put('/update-product/:id', async (req, res) => {

  try {
    const product = await ProductsFrontPage.findById(req.params.id);
    
    if (product) {
      product.category = req.body.category;
      product.productName = req.body.productName;
      product.description = req.body.description;
      product.image = req.body.image;
      product.benefits = req.body.benefits;
      product.features = req.body.features;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new ProductsFrontPage
router.post('/add-product', async (req, res) => {
  const product = new ProductsFrontPage({
    category: req.body.category,
    productName: req.body.productName,
    description: req.body.description,
    image: req.body.image,
    benefits: req.body.benefits,
    features: req.body.features
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product by ID
router.delete('/delete-product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductsFrontPage.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

module.exports = router;

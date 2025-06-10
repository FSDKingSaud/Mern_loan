const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: String,
  productName: String,
  description: String,
  image: String,
  benefits: [String],
  features: [String]
});

const ProductFrontPage = mongoose.model('ProductFrontPage', productSchema);

module.exports = ProductFrontPage;

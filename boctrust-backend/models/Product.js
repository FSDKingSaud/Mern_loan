// create post model
const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product; // export product model



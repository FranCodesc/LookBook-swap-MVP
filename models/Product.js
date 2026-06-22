import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photos: { type: [String], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  swapCount: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);
export default Product;

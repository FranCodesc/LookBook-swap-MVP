import express from "express";
import upload from "../middleware/upload.js";

import {
  createProduct,
  getProducts,
  getProductByID,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", upload.array("photos", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductByID);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;

import express from "express";

import {
  createSwapOrder,
  getSwapOrders,
  getSwapOrderByID,
  updateSwapOrder,
  deleteSwapOrder,
} from "../controllers/swapOrderController.js";

const router = express.Router();

router.post("/", createSwapOrder);
router.get("/", getSwapOrders);
router.get("/:id", getSwapOrderByID);
router.put("/:id", updateSwapOrder);
router.delete("/:id", deleteSwapOrder);

export default router;

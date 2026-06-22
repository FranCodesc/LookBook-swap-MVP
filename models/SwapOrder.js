import mongoose from "mongoose";

const swapSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    proposer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const SwapOrder = mongoose.model("SwapOrder", swapSchema);
export default SwapOrder;

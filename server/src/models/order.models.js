import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true ,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "shipped", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Order", orderSchema);
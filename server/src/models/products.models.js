import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      // required: true,
    },
    image: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
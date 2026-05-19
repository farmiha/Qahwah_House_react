import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    badge: { type: String },
    img: { type: String },
    category: { type: String, enum: ["drinks", "pastries"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);

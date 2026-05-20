import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    orderType: { type: String, enum: ["Dine In", "Takeout"], required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);




// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema({
//   menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   qty: { type: Number, required: true, min: 1 },
// });

// const orderSchema = new mongoose.Schema(
//   {
//     customer: {
//       name: { type: String, required: true },
//       email: { type: String, required: true },
//       phone: { type: String },
//     },
//     orderType: { type: String, enum: ["Dine In", "Takeout"], required: true },
//     items: [orderItemSchema],
//     total: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "completed", "cancelled"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);

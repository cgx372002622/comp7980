const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  time: { type: Date, required: true },
  products: {
    type: [
      {
        productName: String,
        productPrice: Number,
        count: Number,
      },
    ],
    required: true,
  },
  money: { type: Number, required: true },
  status: { type: Number, required: true },
});

const Order = mongoose.model("Order", OrderSchema, "order");

module.exports = { Order };

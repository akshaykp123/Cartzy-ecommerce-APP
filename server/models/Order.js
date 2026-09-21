const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  // NOTE: Index on userId enables rapid indexed lookups (IXSCAN)
  // preventing slow collection scans (COLLSCAN) when customers view their order history
  userId: {
    type: String,
    index: true,
  },
  cartId : String,
  
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
});

module.exports = mongoose.model("Order", OrderSchema);
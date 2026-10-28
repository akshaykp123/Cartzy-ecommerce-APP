const Order = require("../../models/Order");
const { sendNotification } = require("../../helpers/notification");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    // NOTE: Fetch all orders including cartItems and addressInfo using .lean() for maximum performance.
    // Pre-loading order details enables the admin client to pop open order details in 0ms without network lag.
    const orders = await Order.find({})
      .sort({ orderDate: -1 })
      .lean();

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const updateFields = { orderStatus };
    if (orderStatus === "delivered" && order.paymentMethod === "cod") {
      updateFields.paymentStatus = "paid";
    }

    await Order.findByIdAndUpdate(id, updateFields);

    // Notify the specific customer in room user_{userId} and persist in DB
    const io = req.app.get("io");
    const orderShortId = order._id.toString().slice(-6).toUpperCase();

    await sendNotification(io, {
      recipientId: order.userId,
      recipientRole: "user",
      title: "Order Status Updated",
      message: `Your order #${orderShortId} is now "${orderStatus}".`,
      orderId: order._id,
      eventName: "orderStatusUpdated",
      data: {
        orderId: order._id,
        orderStatus,
        paymentStatus: updateFields.paymentStatus || order.paymentStatus,
      },
    });

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
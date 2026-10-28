const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { sendNotification } = require("../../helpers/notification");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Handle Cash on Delivery (COD) orders directly without third-party redirection
    if (paymentMethod === "cod") {
      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus: "confirmed",
        paymentMethod: "cod",
        paymentStatus: "unpaid",
        totalAmount,
        orderDate: orderDate || new Date(),
        orderUpdateDate: orderUpdateDate || new Date(),
        paymentId: "COD",
        payerId: "",
      });

      await newlyCreatedOrder.save();

      // Deduct inventory stock for each ordered product
      for (let item of cartItems) {
        let product = await Product.findById(item.productId);
        if (product) {
          product.totalStock = Math.max(0, product.totalStock - item.quantity);
          await product.save();
        }
      }

      // Clear the user's cart in database
      if (cartId) {
        await Cart.findByIdAndDelete(cartId);
      }

      // Real-time broadcast to admin if socket.io is running
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("newOrderPlaced", newlyCreatedOrder);
      }

      return res.status(201).json({
        success: true,
        isCod: true,
        orderId: newlyCreatedOrder._id,
        message: "Order placed successfully via Cash on Delivery",
      });
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    // Notify admins via WebSocket (admin-room) & persist in MongoDB
    const io = req.app.get("io");
    const orderShortId = order._id.toString().slice(-6).toUpperCase();
    await sendNotification(io, {
      recipientRole: "admin",
      title: "New Order Received!",
      message: `Order #${orderShortId} placed by customer for $${order.totalAmount}`,
      orderId: order._id,
      eventName: "newOrderPlaced",
      data: { order },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
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

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // NOTE: Fetch all user orders with full details using .lean() for fast JSON serialization.
    // Enables the client to open order details in 0ms without waiting for remote server round-trips.
    const orders = await Order.find({ userId })
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

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
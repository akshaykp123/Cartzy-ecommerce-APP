const Notification = require("../models/Notification");

/**
 * Creates a persistent notification in MongoDB and broadcasts it in real-time via Socket.io
 * 
 * @param {object} io - The Socket.io server instance (from req.app.get("io"))
 * @param {object} params
 * @param {string|null} params.recipientId - Target user ID (null for broadcast to all admins)
 * @param {"admin"|"user"} params.recipientRole - Target role
 * @param {string} params.title - Short alert title
 * @param {string} params.message - Descriptive alert message
 * @param {string|null} params.orderId - Associated order ID
 * @param {string} params.eventName - Socket event name (e.g. "newOrderPlaced", "orderStatusUpdated")
 * @param {object} params.data - Any extra payload to send with the real-time event (e.g. order details)
 */
async function sendNotification(io, {
  recipientId = null,
  recipientRole,
  title,
  message,
  orderId = null,
  eventName,
  data = {},
}) {
  try {
    // 1. Store in MongoDB so offline users will see it upon login
    const notification = new Notification({
      recipientId,
      recipientRole,
      title,
      message,
      orderId,
      isRead: false,
    });
    await notification.save();

    // 2. Emit in real-time via WebSockets if io instance is present
    if (io && eventName) {
      const socketPayload = {
        notification,
        ...data,
      };

      if (recipientRole === "admin") {
        io.to("admin-room").emit(eventName, socketPayload);
        console.log(`[Socket.io] Emitted '${eventName}' to admin-room`);
      } else if (recipientId) {
        io.to(`user_${recipientId}`).emit(eventName, socketPayload);
        console.log(`[Socket.io] Emitted '${eventName}' to user_${recipientId}`);
      }
    }

    return notification;
  } catch (error) {
    console.error("[Notification Helper] Error:", error);
    return null;
  }
}

module.exports = { sendNotification };

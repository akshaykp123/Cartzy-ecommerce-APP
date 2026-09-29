const Notification = require("../../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const { userId, role } = req.params;

    let filter = {};
    if (role === "admin") {
      filter = { recipientRole: "admin" };
    } else {
      filter = { recipientId: userId, recipientRole: "user" };
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const unreadCount = notifications.filter((item) => !item.isRead).length;

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("[Notification Controller] Error fetching:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
    });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
    const { userId, role } = req.params;

    let filter = {};
    if (role === "admin") {
      filter = { recipientRole: "admin", isRead: false };
    } else {
      filter = { recipientId: userId, recipientRole: "user", isRead: false };
    }

    await Notification.updateMany(filter, { isRead: true });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("[Notification Controller] Error updating:", error);
    res.status(500).json({
      success: false,
      message: "Error marking notifications as read",
    });
  }
};

module.exports = {
  getNotifications,
  markNotificationsAsRead,
};

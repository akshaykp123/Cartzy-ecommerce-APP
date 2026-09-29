const express = require("express");
const {
  getNotifications,
  markNotificationsAsRead,
} = require("../../controllers/common/notification-controller");

const router = express.Router();

router.get("/get/:userId/:role", getNotifications);
router.put("/mark-as-read/:userId/:role", markNotificationsAsRead);

module.exports = router;

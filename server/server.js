require("dotenv").config();

const http = require("http");
const express = require('express');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes')
const adminProductsRouter = require('./routes/admin/products-routes')
const adminOrderRouter = require('./routes/admin/order-routes')

const shopProductsRouter = require("./routes/shop/products-routes")
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const commonNotificationRouter = require("./routes/common/notification-routes");

// create a database connection

mongoose.connect(
    process.env.MONGO_URL
)
.then(() => console.log("MongoDB connected"))
.catch((error) => console.log(error));
 
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

// Attach io to express app so routes/controllers can access it via req.app.get("io")
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Client joins rooms based on their role and/or userId
  socket.on("join", ({ userId, role }) => {
    if (role === "admin") {
      socket.join("admin-room");
      console.log(`[Socket.io] Socket ${socket.id} (Admin) joined admin-room`);
    }
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`[Socket.io] Socket ${socket.id} (User: ${userId}) joined user_${userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

console.log("ENV CHECK:", process.env.MONGO_URL);
app.use(
    cors({
        origin :  process.env.CLIENT_BASE_URL,
        methods : ['GET','POST','DELETE','PUT'],
        allowedHeaders : [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials : true

    })
);

app.use(cookieParser());
app.use(express.json());

// NOTE: Lightweight health check endpoint.
// Can be pinged by an external uptime service (e.g. UptimeRobot, cron-job.org)
// every 10-14 minutes to prevent Render free-tier instances from spinning down / sleeping.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is active" });
});

app.use('/api/auth', authRouter)
app.use("/api/admin/products",adminProductsRouter)
app.use("/api/admin/orders",adminOrderRouter)
app.use('/api/shop/products',shopProductsRouter)
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter)

app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use('/api/common/feature', commonFeatureRouter)
app.use('/api/common/notifications', commonNotificationRouter)




server.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
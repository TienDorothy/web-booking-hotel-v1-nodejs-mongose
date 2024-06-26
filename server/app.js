const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT;

const authRoute = require("./routes/auth");
const hotelsRoute = require("./routes/hotels");
const roomsRoute = require("./routes/rooms");
const usersRoute = require("./routes/users");
const transactionRoute = require("./routes/transaction");

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.URL);
  } catch (err) {
    throw new Error(err);
  }
};
const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
      process.env.TEST_URL,
    ],
    credentials: true,
  })
);

// route
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/transactions", transactionRoute);

// handle error
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal server error";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(port, () => {
  connectMongoDb();
  console.log("Connect port:", port);
});

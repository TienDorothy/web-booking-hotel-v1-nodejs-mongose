const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

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
const store = new MongoDBStore({
  uri: process.env.URL,
  collection: "sessions",
});

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

app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    store: store,
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
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
const port=process.env.PORT
// const port = 5001;
app.listen(port, () => {
  connectMongoDb();
  console.log("Connect port:", port);
});

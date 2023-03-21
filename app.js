require("dotenv").config();
require("express-async-errors");

//for security, using helmet package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middlewares/authentication");

//routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const leaveRouter = require("./routes/leave");
const adminRouter = require("./routes/admin");

const corsOptions = {
  origin: "*",
  methods: ["OPTIONS", "GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windows
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profiles", authenticateUser, profileRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/leaves", authenticateUser, leaveRouter);
app.use("/api/v1/admins", authenticateUser, adminRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

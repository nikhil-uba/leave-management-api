require("dotenv").config();
require("express-async-errors");

//for security, using helmet package
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

const connectDB = require("./util/db/connect");
const auth = require("./middleware/auth");

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
    max: 1000, // limit each IP to 100 requests per windows
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors(corsOptions));
app.use(xss());

app.use(express.json());
app.use(
  "/storage/profile/images",
  express.static(path.join(__dirname, "storage/profile/images"))
);
app.use(
  "/storage/leave/attachments",
  express.static(path.join(__dirname, "storage/leave/attachments"))
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profiles", auth, profileRouter);
app.use("/api/v1/users", auth, userRouter);
app.use("/api/v1/leaves", auth, leaveRouter);
app.use("/api/v1/admins", auth, adminRouter);

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

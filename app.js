require("dotenv").config();
require("express-async-errors");

//for security, using helmet package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const multer = require("multer");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profileImages/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimeType === "image/png" ||
    file.mimeType === "image/jpg" ||
    file.mimeType === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage });

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windows
  })
);

app.use(express.json());

//file upload
app.use(upload.single("file"));
app.use(upload.array("files", 10));

app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());

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

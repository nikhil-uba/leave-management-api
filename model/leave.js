const mongoose = require("mongoose");
const fileSchema = require("./File");

const LeaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    leaveStart: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    leaveDetail: { type: String, required: true, maxlength: 255 },
    sendEmail: { type: Boolean, required: true },
    attachment: [
      {
        type: fileSchema,
        required: false,
      },
    ],
    reviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", LeaveSchema);

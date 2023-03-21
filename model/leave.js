const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    squad: { type: String, required: true },
    leaveType: {
      type: String,
      required: true,
    },
    leaveStart: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    leaveDetail: { type: String, required: true, maxlength: 255 },
    emailSent: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", LeaveSchema);

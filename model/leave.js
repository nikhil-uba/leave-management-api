const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    leaveTakenBy: {
      type: String,
      required: [true, "Please enter your email"],
    },
    to: {
      type: Array,
    },
    subject: {
      type: String,
      required: [true, "Please enter the subjcet for the mail/leave"],
    },
    text: {
      type: String,
      required: [true, "Please provide description in less than 200 words"],
      maxlength: 200,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("leave", LeaveSchema);

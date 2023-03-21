const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your registered email"],
    },
    department: {
      type: String,
      required: [true, "Please specify your working department"],
    },
    team: {
      type: String,
      required: [true, "Please specify your team"],
    },
    LeavesRemaining: {
      type: Number,
      default: 25,
    },
    profileOf: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide User"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);

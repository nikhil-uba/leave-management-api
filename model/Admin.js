const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: [true, "Please provide the userId"],
    },
    name: {
      type: String,
      required: [true, "Please provide the name"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);

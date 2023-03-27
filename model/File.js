const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filepath: {
    type: String,
    required: false,
  },
  filename: { type: String, required: false },
  mimetype: {
    type: String,
    required: false,
  },
});

module.exports = fileSchema;

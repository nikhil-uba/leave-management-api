const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  file: {
    type: Buffer,
    required: false,
  },
  filename: { type: String, required: false },
  mimetype: {
    type: String,
    required: false,
  },
});

module.exports = fileSchema;

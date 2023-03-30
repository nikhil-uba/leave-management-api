const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileSchema = require("./File");

const addressSchema = new mongoose.Schema({
  temporary: {
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
  },
  permanent: {
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
  },
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: false,
      maxlength: 32,
      minlength: 3,
    },
    middleName: {
      type: String,
      required: false,
      maxlength: 32,
    },
    lastName: {
      type: String,
      required: false,
      maxlength: 32,
      minlength: 3,
    },
    address: { type: addressSchema, required: false },
    secondaryEmail: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
      validate: {
        validator: function (value) {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: "Invalid email",
      },
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    primaryContact: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    secondaryContact: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    squad: {
      type: String,
      required: false,
    },
    department: {
      type: String,
      required: false,
    },
    leavesRemaining: {
      type: Number,
      default: 25,
    },
    leavesTaken: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasProfile: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: fileSchema,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.JWT_SECRET
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);

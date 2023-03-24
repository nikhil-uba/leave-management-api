//loading .env files in process.env
require("dotenv").config();
//importing other required items
const connectDB = require("./db/connect");
const jsonUsers = require("./UBA_Members.json");
const jsonAdmins = require("./Admins.json");
const User = require("./model/User");

//async function is used because we need to assure the database connection first. without it there is no point of this code.
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await User.deleteMany(); //to delete the Admin created while testing.
    await User.create(jsonUsers); //actually populating the database
    await User.updateMany({ $or: jsonAdmins }, { $set: { isAdmin: true } });
    console.log("The addition was successful"); //to ensure the successful addition of Admin in database
    process.exit(0); //exiting the program successfully
  } catch (error) {
    console.log(error);
    process.exit(1); //exiting the program with error.
  }
};

start();

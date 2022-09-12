const mongoose = require('mongoose')

//the connection link is in the .env file to enhance the security of the system.
//which is passed as 'url' while the database connection is required.
const connectDB = (url) => {
  return mongoose.connect(url)
}
module.exports = connectDB
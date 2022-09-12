require('dotenv').config();
require('express-async-errors')
const authenticateUser = require('./middlewares/authentication')
const express = require('express')
const  app = express()

const connectDB = require('./db/connect')

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user')




app.use(express.json());


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/profiles',authenticateUser,profileRouter);
app.use('/api/v1/users',authenticateUser,userRouter);


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
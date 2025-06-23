require('dotenv').config()
const mongoose = require('mongoose');

const encodeURIPart = encodeURIComponent("##");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI1}${encodeURIPart}${process.env.MONGODB_URI2}`);//process.env.MONGODB_URI);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

/*
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))
*/

module.exports = connectDB;
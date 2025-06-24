require('dotenv').config()
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const express = require('express')
const morgan = require('morgan');

const app = express()

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const userRouter = require('./routes/user')
app.use('/', userRouter)

app.listen(process.env.PORT || 5000, () => console.log('Server Started'))
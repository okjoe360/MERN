require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const cors = require('cors'); // Import cors
const authMiddleware = require('./authMiddleware');
const connectDB = require('./db');
const express = require('express')

const app = express()

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

const userRouter = require('./routes/user')
app.use('/', userRouter)

app.listen(process.env.PORT || 5000, () => console.log('Server Started'))
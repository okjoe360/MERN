require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router()
const User = require('../models/user')
const dbSch = require('../databaseSchema.json');
// Getting all

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json({users, dbSch})
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
/*
// Getting One
router.get('/:id', getSubscriber, (req, res) => {
  res.json(res.subscriber)
})
*/
// Registering User
router.post('/register', async (req, res) => {
    console.log(req.body)
    const {email, password, firstName, lastName } = req.body
    if (!email || !password || !firstName || !lastName){
        res.status(404).json({ message: "All fields are require"})
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newUserInstance = new User({email, password : passwordHash, firstName, lastName })

    try {
        const newUser = await newUserInstance.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Login User
router.post('/login', async (req, res) => {
    const {email, password } = req.body
    if (!email || !password ){
        res.status(404).json({ message: "Username and password are required"})
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // User authenticated, create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Use user._id from MongoDB
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return res.json({ message: 'Logged in successfully', token, email: user.email, firstName: user.firstName });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error during login' });
    }
})

// Updating One
/*
router.patch('/:id', getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel
  }
  try {
    const updatedSubscriber = await res.subscriber.save()
    res.json(updatedSubscriber)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove()
    res.json({ message: 'Deleted Subscriber' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
*/
async function getSubscriber(req, res, next) {
  let subscriber
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.subscriber = subscriber
  next()
}

module.exports = router
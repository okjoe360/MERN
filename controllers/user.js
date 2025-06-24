require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user')
const dbSch = require('../databaseSchema.json');

// Getting all
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json({users, dbSch})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Registering User
exports.register = async (req, res) => {
    console.log(req.body)
    const {email, password, firstName, lastName } = req.body
    if (!email || !password || !firstName || !lastName) res.status(400).json({ message: "All fields are require"})

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newUserInstance = new User({email, password : passwordHash, firstName, lastName })

    try {
        const newUser = await newUserInstance.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Login User
exports.login = async (req, res) => {
    const {email, password } = req.body
    if (!email || !password ) return res.status(400).json({ 'message': 'Email and password are required.' });

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'Invalid credentials' }); //Unauthorized 

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // User authenticated, create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Use user._id from MongoDB
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return res.json({ message: 'Logged in successfully', token, email: user.email, firstName: user.firstName });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: err.message })
        /*return res.status(500).json({ message: 'Internal server error during login' });*/
    }
}

// Updating One
exports.updateUser = async (req, res) => {
  try {
    //const { id } = req.params;
    //const updates = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true // validate the updates
    });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Deleting One
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'Deleted Subscriber' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

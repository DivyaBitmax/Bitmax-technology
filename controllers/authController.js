// controllers/authController.js
const User   = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');   

// -------------- REGISTER -----------------
exports.register = async (req, res) => {
  const { fullName, email, phone, password, confirmPassword } = req.body;

  // basic validations
  if (!fullName || !email || !phone || !password || !confirmPassword)
    return res.status(400).json({ message: 'all fields are required..' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'password is not matching..!' });

  try {
    // user already?
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: 'User already registered, please login' });

    // hash the password
    const hashed = await bcrypt.hash(password, 10);

    // save user
    user = new User({ fullName, email, phone, password: hashed });
    await user.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------- LOGIN -----------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // simple checks
  if (!email || !password)
    return res.status(400).json({ message: 'Email and Password required' });

  try {
    // user exist?
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    // password match?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // create JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    const user = new User({
      userId,
      username,
      email,
      password: hashedPassword
    });
    await user.save();
    const token = jwt.sign(
      { id: user._id, userId: user.userId, username: user.username },
      process.env.JWT_SECRET
    );
    return res.json({ message: 'Signup successful', token });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign(
      { id: user._id, userId: user.userId, username: user.username },
      process.env.JWT_SECRET
    );
    return res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login
}

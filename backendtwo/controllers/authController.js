// Example authController.js
const User = require('../models/userModel'); // Adjust the import as per your file structure
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function signupUser(req, res) {
  const { email, password } = req.body;

  try {
    // Check if email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    user = new User({
      email,
      password // Remember to hash the password before saving to DB
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to DB
    await user.save();

    // Respond with success
    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Return JWT token (example)
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}

module.exports = { signupUser, loginUser };

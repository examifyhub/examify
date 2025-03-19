require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('express.json');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/examify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Register Endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, email, password } = req.body;
  res.json({ message: "Login endpoint working!" });

  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

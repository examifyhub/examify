require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

const cors = require('cors');
app.use(cors({ origin: '*' }));


// ✅ Secure CORS - Allow only frontend origin
const allowedOrigins = [
  'https://examify-5x8xes45b-sanga28s-projects.vercel.app', // Your Vercel frontend
  'http://localhost:3000' // Local development
];

app.use(cors({
  origin: ['https://examify-5x8xes45b-sanga28s-projects.vercel.app', 'http://localhost:3000'], // Allow only frontend origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies & auth headers
}));


app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1); // Exit on DB failure
});

// ✅ User Schema & Model
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// ✅ Register Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({ message: 'Login successful', user });
});


// ✅ Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!password || (!username && !email)) {
      return res.status(400).json({ message: 'Username or Email and Password are required' });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

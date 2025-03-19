require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration (Allow frontend access)
app.use(cors({ 
  origin: ['https://examify-5x8xes45b-sanga28s-projects.vercel.app', 'http://localhost:3000'], 
  credentials: true 
}));

app.use(bodyParser.json());

// ✅ MongoDB Connection (No Authentication Required)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ✅ HEALTH CHECK (Test if server is running)
app.get('/api/health', (req, res) => {
  res.json({ message: "✅ Server is running without authentication" });
});

// ✅ Example Route (Public, No Authentication)
app.get('/api/data', (req, res) => {
  res.json({ message: "This is public data, no login required!" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


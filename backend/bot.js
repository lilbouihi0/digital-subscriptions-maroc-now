const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store OTPs temporarily (in production, use a database)
const otps = {};

// Send OTP endpoint
app.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store the OTP (in a real app, you would send this via SMS)
  otps[phone] = otp;
  
  console.log(`OTP for ${phone}: ${otp}`);
  
  return res.json({ 
    message: `OTP sent to ${phone}`,
    // In a real app, don't send the OTP back to the client
    // This is just for testing purposes
    otp: otp 
  });
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }
  
  if (otps[phone] === otp) {
    // OTP is valid, clear it from storage
    delete otps[phone];
    return res.json({ message: 'OTP is valid ✅' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP ❌' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
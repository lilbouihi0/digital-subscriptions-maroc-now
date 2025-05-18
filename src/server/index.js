const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const verificationCodes = new Map();

app.post('/api/send-verification', async (req, res) => {
  const { phoneNumber } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(phoneNumber, code);

  try {
    // Replace with actual MCP API call
    await axios.post('https://mcp-api.example.com/send', {
      to: phoneNumber,
      message: `Your verification code is: ${code}`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending message via MCP:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/api/verify-code', (req, res) => {
  const { phoneNumber, code } = req.body;
  const storedCode = verificationCodes.get(phoneNumber);
  if (storedCode === code) {
    verificationCodes.delete(phoneNumber);
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

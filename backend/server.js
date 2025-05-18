/// backend/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sendVerificationCode } from './whatsapp.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/send-code', async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const code = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationCode(phoneNumber, code);
    res.status(200).json({ success: true, code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending code' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
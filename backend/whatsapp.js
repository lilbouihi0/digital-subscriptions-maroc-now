// backend/whatsapp.js
import { create } from 'venom-bot';

let client = null;

// Initialize WhatsApp client
async function initWhatsApp() {
  try {
    client = await create({
      session: 'verification-session',
      multidevice: true,
      headless: true, // Run in headless mode
      useChrome: false, // Use Chromium instead of Chrome
      debug: false,
      logQR: true, // Log QR code to console
    });

    console.log('WhatsApp client initialized successfully');
    
    // Handle connection events
    client.onStateChange((state) => {
      console.log('Connection state:', state);
      if (state === 'CONFLICT' || state === 'UNLAUNCHED') {
        client.useHere();
      }
    });

    return client;
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    throw error;
  }
}

// Send verification code via WhatsApp
export async function sendVerificationCode(phoneNumber, code) {
  try {
    // Initialize client if not already initialized
    if (!client) {
      await initWhatsApp();
    }

    // Format phone number (remove '+' and ensure it has country code)
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    
    // Message template
    const message = `Your verification code is: *${code}*\n\nThis code will expire in 10 minutes.`;
    
    // Send message
    const result = await client.sendText(`${formattedNumber}@c.us`, message);
    console.log('Verification code sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
}

// Initialize WhatsApp client when the module is imported
initWhatsApp().catch(console.error);
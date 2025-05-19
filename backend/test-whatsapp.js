// backend/test-whatsapp.js
import { sendVerificationCode } from './whatsapp.js';

// Test phone number - replace with your own number for testing
const testPhoneNumber = '+1234567890'; // Replace with your WhatsApp number

async function testWhatsAppVerification() {
  try {
    console.log('Testing WhatsApp verification...');
    console.log(`Sending test code to ${testPhoneNumber}`);
    
    // Generate a test verification code
    const code = Math.floor(100000 + Math.random() * 900000);
    
    // Send the code via WhatsApp
    await sendVerificationCode(testPhoneNumber, code);
    
    console.log('Test message sent successfully!');
    console.log(`Verification code: ${code}`);
  } catch (error) {
    console.error('Error testing WhatsApp verification:', error);
  }
}

// Run the test
testWhatsAppVerification();
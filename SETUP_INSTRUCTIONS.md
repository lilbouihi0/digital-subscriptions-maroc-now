# WhatsApp Verification Setup Instructions

## Overview

We've replaced the Firebase phone verification system with a WhatsApp-based verification system using Venom Bot. This new system sends verification codes via WhatsApp instead of SMS, providing a more cost-effective and reliable solution.

## Setup Steps

### 1. Install Dependencies

First, install the required dependencies:

```bash
# Install venom-bot in the main project (already done)
cd e:/DigiSubs/digital-subscriptions1108
# npm install venom-bot has been run

# Install backend dependencies
cd backend
npm install
```

### 2. Test WhatsApp Integration

Before integrating with the frontend, test that the WhatsApp integration works:

1. Edit the test script with your phone number:
   - Open `backend/test-whatsapp.js`
   - Replace `+1234567890` with your actual WhatsApp number (including country code)

2. Run the test script:
   ```bash
   cd backend
   node test-whatsapp.js
   ```

3. On first run, you'll need to authenticate:
   - A QR code will be displayed in the console
   - Scan this QR code with your WhatsApp mobile app
   - You should receive a test verification code on your WhatsApp

### 3. Start the Backend Server

Once testing is successful, start the backend server:

```bash
cd backend
npm start
```

The server will run on http://localhost:3001

### 4. Run the Frontend Application

In a separate terminal, start the frontend application:

```bash
cd e:/DigiSubs/digital-subscriptions1108
npm run dev
```

## Verification Flow

1. User enters their phone number in the verification form
2. System sends a 6-digit code to the user's WhatsApp
3. User enters the code in the verification form
4. System verifies the code and completes the verification process

## Files Modified/Created

### Backend
- `backend/whatsapp.js` - WhatsApp integration using Venom Bot
- `backend/package.json` - Added venom-bot dependency
- `backend/test-whatsapp.js` - Test script for WhatsApp integration
- `backend/README.md` - Documentation for the backend

### Frontend
- `src/components/spin-wheel/hooks/useWhatsAppVerification.ts` - New hook for WhatsApp verification
- `src/components/spin-wheel/PhoneVerification.tsx` - Updated to use WhatsApp verification
- `src/components/spin-wheel/PhoneInput.tsx` - Removed reCAPTCHA container

## Troubleshooting

- If you encounter issues with WhatsApp authentication, delete the session files and restart the server
- If verification codes aren't being sent, check the console logs for errors
- Make sure both the backend server and frontend application are running
- Ensure the phone number is in the correct format with country code (e.g., +1234567890)

For more detailed information, refer to `WHATSAPP_VERIFICATION_IMPLEMENTATION.md` and `backend/README.md`.
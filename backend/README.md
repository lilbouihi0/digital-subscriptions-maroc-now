# Verification Systems

This directory contains two verification systems:

1. WhatsApp Verification System - Uses WhatsApp to send verification codes
2. Phone OTP Verification System - Uses a simple OTP mechanism for phone verification

## Setup Instructions

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Start the backend server:
   ```
   npm start
   ```

3. On first run, you'll need to authenticate with WhatsApp:
   - A QR code will be displayed in the console
   - Scan this QR code with your WhatsApp mobile app:
     - Open WhatsApp on your phone
     - Tap Menu or Settings
     - Select WhatsApp Web/Desktop
     - Point your phone to the QR code on your screen to scan it

4. The server will save your session, so you won't need to scan the QR code again unless you log out or the session expires.

## How It Works

1. When a user enters their phone number and requests verification:
   - The frontend calls the backend API endpoint `/api/send-code`
   - The backend generates a 6-digit verification code
   - The code is sent to the user's phone number via WhatsApp
   - The code is also returned to the frontend (in a real production environment, this would be stored securely on the server)

2. When the user enters the verification code:
   - The frontend validates the code locally by comparing it with the code received from the backend
   - If valid, the user is marked as verified

## Security Considerations

For a production environment, consider these security enhancements:

1. Store verification codes on the server with expiration times, not in the frontend
2. Implement rate limiting to prevent abuse
3. Add HTTPS for all API communications
4. Implement proper error handling and logging
5. Consider using a dedicated WhatsApp Business API for higher volume applications

## Troubleshooting

- If the WhatsApp client disconnects, restart the server
- If you encounter authentication issues, delete the `.wwebjs_auth` directory and restart the server to re-authenticate
- Check the console logs for detailed error messages

## Phone OTP Verification System

### Setup Instructions

1. Install dependencies:
   ```bash
   npm install express body-parser cors
   ```

2. Run the server:
   ```bash
   node bot.js
   ```

   The server will start on port 3000.

### EC2 Security Group Configuration

If you're running this on an EC2 instance, make sure to configure the security group to allow inbound traffic on port 3000:

1. Go to the EC2 console in AWS
2. Select your instance
3. Click on the Security tab
4. Click on the Security Group
5. Add an inbound rule:
   - Type: Custom TCP
   - Port Range: 3000
   - Source: Your IP address (for security) or 0.0.0.0/0 (for testing only)
   - Description: Phone Verification API

### Testing the API

You can test the API endpoints using curl or Postman:

#### Send OTP:
```bash
curl -X POST http://56.228.34.55:3000/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "212600000000"}'
```

#### Verify OTP:
```bash
curl -X POST http://56.228.34.55:3000/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "212600000000", "otp": "123456"}'
```

### Security Considerations

- In a production environment, you should:
  - Use HTTPS instead of HTTP
  - Store OTPs in a database with expiration
  - Implement rate limiting to prevent abuse
  - Add proper authentication and authorization
  - Consider using a service like AWS SNS or Twilio for sending SMS
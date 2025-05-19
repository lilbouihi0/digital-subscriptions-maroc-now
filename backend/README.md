# WhatsApp Verification System

This system replaces the Firebase phone verification with a WhatsApp-based verification system using Venom Bot.

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
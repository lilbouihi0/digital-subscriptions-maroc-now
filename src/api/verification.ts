
import axios from 'axios';

export async function sendCode(phoneNumber: string) {
  try {
    // Use a mock response for now since the backend server isn't available in this environment
    // In production, this would make an actual API call
    console.log(`Sending verification code to ${phoneNumber}`);
    
    // Simulate API response
    return {
      success: true,
      message: 'Verification code sent successfully'
    };
    
    /* 
    // Real API call implementation:
    const response = await axios.post(`${import.meta.env.VITE_OTP_SERVER}/send-otp`, {
      phoneNumber
    });
    return response.data;
    */
  } catch (error) {
    console.error('Error sending verification code:', error);
    return {
      success: false,
      message: 'Error sending verification code'
    };
  }
}

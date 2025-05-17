import axios from 'axios';

export const sendVerificationCode = async (phoneNumber: string) => {
  try {
    const response = await axios.post('/api/send-verification', { phoneNumber });
    return response.data;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

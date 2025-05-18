import axios from 'axios';

export const verifyCode = async (phoneNumber: string, code: string) => {
  try {
    const response = await axios.post('/api/verify-code', { phoneNumber, code });
    return response.data;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

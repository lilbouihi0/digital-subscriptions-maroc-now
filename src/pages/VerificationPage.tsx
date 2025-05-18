import { verifyCode } from '../api/verifyCode';

// ...

const handleVerifyCode = async () => {
  try {
    const result = await verifyCode(phoneNumber, code);
    if (result.success) {
      setMessage('Phone number verified successfully.');
    } else {
      setMessage('Invalid verification code.');
    }
  } catch {
    setMessage('Verification failed.');
  }
};

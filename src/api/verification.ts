
export async function sendCode(phoneNumber: string) {
  try {
    const response = await fetch('http://localhost:3001/api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, message: 'Error sending code' };
  }
}

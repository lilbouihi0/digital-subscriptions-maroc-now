/// src/api/verification.ts
export async function sendCode(phoneNumber: string) {
  const response = await fetch('http://localhost:3001/api/send-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  return await response.json();
}
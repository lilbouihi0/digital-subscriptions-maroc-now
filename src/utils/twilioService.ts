
/**
 * Twilio Verify Service Integration
 */

// Create a function to send verification code
export async function sendVerificationCode(phoneNumber: string): Promise<boolean> {
  try {
    // Make API call to our server endpoint that will call Twilio
    const response = await fetch('/api/verify/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error sending verification code:', data.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send verification code:', error);
    return false;
  }
}

// Create a function to verify the code
export async function verifyCode(phoneNumber: string, code: string): Promise<boolean> {
  try {
    // Make API call to our server endpoint that will verify with Twilio
    const response = await fetch('/api/verify/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, code }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error verifying code:', data.message);
      return false;
    }
    
    return data.valid;
  } catch (error) {
    console.error('Failed to verify code:', error);
    return false;
  }
}

// Create a function to spin and get prize (server-side logic)
export async function spinWheel(phoneNumber: string): Promise<any> {
  try {
    const response = await fetch('/api/spin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error spinning wheel:', data.message);
      throw new Error(data.message || 'Failed to spin wheel');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to spin wheel:', error);
    throw error;
  }
}

// Check if user has already spun today
export async function hasSpunToday(phoneNumber: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/spin/check?phone=${encodeURIComponent(phoneNumber)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error checking spin status:', data.message);
      return true; // Default to true to prevent spinning if there's an error
    }
    
    return data.hasSpun;
  } catch (error) {
    console.error('Failed to check spin status:', error);
    return true; // Default to true to prevent spinning if there's an error
  }
}

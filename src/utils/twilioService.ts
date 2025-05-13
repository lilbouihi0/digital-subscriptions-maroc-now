
/**
 * Twilio Service Integration
 * Note: Phone verification (sendVerificationCode, verifyCode) has been migrated to Firebase.
 * These functions are removed from here.
 */

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
      console.error('Error spinning wheel:', data.message || data.error);
      throw new Error(data.message || data.error || 'Failed to spin wheel');
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
    const response = await fetch(`/api/spin-check?phone=${encodeURIComponent(phoneNumber)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error checking spin status:', data.message || data.error);
      return true; // Default to true to prevent spinning if there's an error
    }
    
    return data.hasSpun === true;
  } catch (error) {
    console.error('Failed to check spin status:', error);
    return true; // Default to true to prevent spinning if there's an error
  }
}

// Validate a prize code (for admin)
export async function validateCode(code: string): Promise<any> {
  try {
    const response = await fetch('/api/validate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Invalid code');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to validate code:', error);
    throw error;
  }
}

// Redeem a prize code (for admin)
export async function redeemCode(code: string, adminKey: string): Promise<any> {
  try {
    const response = await fetch('/api/redeem-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, adminKey }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to redeem code');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to redeem code:', error);
    throw error;
  }
}


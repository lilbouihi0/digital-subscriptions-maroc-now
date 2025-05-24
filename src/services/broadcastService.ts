/**
 * Broadcast Service
 * 
 * This service handles cross-tab communication to ensure that
 * if a user spins in one tab, other tabs are updated.
 */

// Broadcast channel for spin events
let spinChannel: BroadcastChannel | null = null;

// Event types
export enum BroadcastEventType {
  SPIN_RECORDED = 'SPIN_RECORDED',
  TRY_AGAIN_MARKED = 'TRY_AGAIN_MARKED',
  TRY_AGAIN_USED = 'TRY_AGAIN_USED'
}

// Event interface
export interface BroadcastEvent {
  type: BroadcastEventType;
  data: {
    phoneNumber: string;
    deviceId: string;
    timestamp: number;
  };
}

// Initialize the broadcast channel
export const initBroadcastChannel = (): void => {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      spinChannel = new BroadcastChannel('spin_wheel_channel');
    }
  } catch (error) {
    console.error('Failed to initialize BroadcastChannel:', error);
  }
};

// Send a broadcast event
export const broadcastEvent = (event: BroadcastEvent): void => {
  try {
    if (spinChannel) {
      spinChannel.postMessage(event);
    }
  } catch (error) {
    console.error('Failed to broadcast event:', error);
  }
};

// Listen for broadcast events
export const listenForBroadcastEvents = (callback: (event: BroadcastEvent) => void): () => void => {
  if (!spinChannel) {
    initBroadcastChannel();
  }
  
  const handleMessage = (event: MessageEvent) => {
    callback(event.data);
  };
  
  if (spinChannel) {
    spinChannel.addEventListener('message', handleMessage);
    
    // Return a cleanup function
    return () => {
      spinChannel?.removeEventListener('message', handleMessage);
    };
  }
  
  // Return a no-op cleanup function if channel isn't available
  return () => {};
};

// Close the broadcast channel
export const closeBroadcastChannel = (): void => {
  if (spinChannel) {
    spinChannel.close();
    spinChannel = null;
  }
};

// Initialize the channel when the module is loaded
if (typeof window !== 'undefined') {
  initBroadcastChannel();
  
  // Clean up when the window is closed
  window.addEventListener('beforeunload', closeBroadcastChannel);
}
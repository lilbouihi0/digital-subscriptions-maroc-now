// This service handles tracking of spins to prevent multiple spins per day
// It uses both phone number and device fingerprint to identify users
// and stores data in IndexedDB for persistence across sessions and private browsing

import {
  SpinRecord,
  saveSpinRecord,
  getAllSpinRecords,
  getSpinRecordsByPhone,
  getSpinRecordsByDevice,
  cleanupOldRecords as cleanupOldDBRecords,
  isIndexedDBAvailable
} from './indexedDBService';

import {
  broadcastEvent,
  BroadcastEventType
} from './broadcastService';

// Fallback localStorage key if IndexedDB is not available
const SPIN_RECORDS_KEY = 'spinRecords';

// Get all spin records (with fallback to localStorage)
export const getSpinRecords = async (): Promise<SpinRecord[]> => {
  if (isIndexedDBAvailable()) {
    return await getAllSpinRecords();
  } else {
    // Fallback to localStorage
    const records = localStorage.getItem(SPIN_RECORDS_KEY);
    return records ? JSON.parse(records) : [];
  }
};

// Save spin records to localStorage (fallback method)
const saveSpinRecordsToLocalStorage = (records: SpinRecord[]): void => {
  localStorage.setItem(SPIN_RECORDS_KEY, JSON.stringify(records));
};

// Check if a user has already spun today
export const hasSpunToday = async (phoneNumber: string, deviceId: string): Promise<boolean> => {
  const today = new Date().toDateString();
  
  if (isIndexedDBAvailable()) {
    // Get records by phone number
    const phoneRecords = await getSpinRecordsByPhone(phoneNumber);
    const phoneHasSpun = phoneRecords.some(record => 
      record.lastSpinDate === today && !record.gotTryAgain
    );
    
    if (phoneHasSpun) return true;
    
    // Get records by device ID
    const deviceRecords = await getSpinRecordsByDevice(deviceId);
    return deviceRecords.some(record => 
      record.lastSpinDate === today && !record.gotTryAgain
    );
  } else {
    // Fallback to localStorage
    const records = localStorage.getItem(SPIN_RECORDS_KEY);
    const parsedRecords: SpinRecord[] = records ? JSON.parse(records) : [];
    
    return parsedRecords.some(record => 
      (record.phoneNumber === phoneNumber || record.deviceId === deviceId) && 
      record.lastSpinDate === today && 
      !record.gotTryAgain
    );
  }
};

// Check if a user has a "Try Again" chance
export const hasTryAgainChance = async (phoneNumber: string, deviceId: string): Promise<boolean> => {
  const today = new Date().toDateString();
  
  if (isIndexedDBAvailable()) {
    // Get records by phone number
    const phoneRecords = await getSpinRecordsByPhone(phoneNumber);
    const phoneHasTryAgain = phoneRecords.some(record => 
      record.lastSpinDate === today && record.gotTryAgain
    );
    
    if (phoneHasTryAgain) return true;
    
    // Get records by device ID
    const deviceRecords = await getSpinRecordsByDevice(deviceId);
    return deviceRecords.some(record => 
      record.lastSpinDate === today && record.gotTryAgain
    );
  } else {
    // Fallback to localStorage
    const records = localStorage.getItem(SPIN_RECORDS_KEY);
    const parsedRecords: SpinRecord[] = records ? JSON.parse(records) : [];
    
    return parsedRecords.some(record => 
      (record.phoneNumber === phoneNumber || record.deviceId === deviceId) && 
      record.lastSpinDate === today && 
      record.gotTryAgain
    );
  }
};

// Record a spin for a user
export const recordSpin = async (
  phoneNumber: string, 
  deviceId: string, 
  gotTryAgain: boolean = false
): Promise<void> => {
  // First check if the user has already spun today
  const alreadySpunToday = await hasSpunToday(phoneNumber, deviceId);
  
  // If they've already spun today and it's not a "try again" spin, don't allow it
  if (alreadySpunToday && !gotTryAgain) {
    console.log('User has already spun today and does not have a try again chance');
    return;
  }
  
  const today = new Date().toDateString();
  const timestamp = Date.now();
  
  if (isIndexedDBAvailable()) {
    // Create a new record
    const newRecord: SpinRecord = {
      phoneNumber,
      deviceId,
      lastSpinDate: today,
      gotTryAgain,
      timestamp
    };
    
    // Save to IndexedDB
    await saveSpinRecord(newRecord);
  } else {
    // Fallback to localStorage
    const records = localStorage.getItem(SPIN_RECORDS_KEY);
    const parsedRecords: SpinRecord[] = records ? JSON.parse(records) : [];
    
    // Remove any existing records for this phone number or device ID for today
    const filteredRecords = parsedRecords.filter(record => 
      !(record.phoneNumber === phoneNumber || record.deviceId === deviceId) || 
      record.lastSpinDate !== today
    );
    
    // Add the new record
    filteredRecords.push({
      phoneNumber,
      deviceId,
      lastSpinDate: today,
      gotTryAgain,
      timestamp
    });
    
    saveSpinRecordsToLocalStorage(filteredRecords);
  }
  
  // Also store in a cookie for additional persistence
  document.cookie = `lastSpin_${phoneNumber}=${today};path=/;max-age=2592000`; // 30 days
  
  // Broadcast the event to other tabs
  broadcastEvent({
    type: BroadcastEventType.SPIN_RECORDED,
    data: {
      phoneNumber,
      deviceId,
      timestamp
    }
  });
};

// Update a record to mark it as "Try Again"
export const markAsTryAgain = async (phoneNumber: string, deviceId: string): Promise<void> => {
  const today = new Date().toDateString();
  const timestamp = Date.now();
  
  if (isIndexedDBAvailable()) {
    // Get records by phone number and device ID
    const phoneRecords = await getSpinRecordsByPhone(phoneNumber);
    const deviceRecords = await getSpinRecordsByDevice(deviceId);
    
    // Combine and filter for today's records
    const todayRecords = [...phoneRecords, ...deviceRecords].filter(
      record => record.lastSpinDate === today
    );
    
    // Update each record
    for (const record of todayRecords) {
      await saveSpinRecord({
        ...record,
        gotTryAgain: true,
        timestamp
      });
    }
  } else {
    // Fallback to localStorage
    const records = localStorage.getItem(SPIN_RECORDS_KEY);
    const parsedRecords: SpinRecord[] = records ? JSON.parse(records) : [];
    
    const updatedRecords = parsedRecords.map(record => {
      if ((record.phoneNumber === phoneNumber || record.deviceId === deviceId) && 
          record.lastSpinDate === today) {
        return { ...record, gotTryAgain: true, timestamp };
      }
      return record;
    });
    
    saveSpinRecordsToLocalStorage(updatedRecords);
  }
  
  // Broadcast the event to other tabs
  broadcastEvent({
    type: BroadcastEventType.TRY_AGAIN_MARKED,
    data: {
      phoneNumber,
      deviceId,
      timestamp
    }
  });
};

// Use up a "Try Again" chance
export const useTryAgainChance = async (phoneNumber: string, deviceId: string): Promise<void> => {
  const today = new Date().toDateString();
  const timestamp = Date.now();
  
  if (isIndexedDBAvailable()) {
    // Get records by phone number and device ID
    const phoneRecords = await getSpinRecordsByPhone(phoneNumber);
    const deviceRecords = await getSpinRecordsByDevice(deviceId);
    
    // Combine and filter for today's records with try again
    const tryAgainRecords = [...phoneRecords, ...deviceRecords].filter(
      record => record.lastSpinDate === today && record.gotTryAgain
    );
    
    // Update each record
    for (const record of tryAgainRecords) {
      await saveSpinRecord({
        ...record,
        gotTryAgain: false,
        timestamp
      });
    }
  } else {
    // Fallback to localStorage
    const records = localStorage.getItem(SPIN_RECORDS_KEY);
    const parsedRecords: SpinRecord[] = records ? JSON.parse(records) : [];
    
    const updatedRecords = parsedRecords.map(record => {
      if ((record.phoneNumber === phoneNumber || record.deviceId === deviceId) && 
          record.lastSpinDate === today && 
          record.gotTryAgain) {
        return { ...record, gotTryAgain: false, timestamp };
      }
      return record;
    });
    
    saveSpinRecordsToLocalStorage(updatedRecords);
  }
  
  // Broadcast the event to other tabs
  broadcastEvent({
    type: BroadcastEventType.TRY_AGAIN_USED,
    data: {
      phoneNumber,
      deviceId,
      timestamp
    }
  });
};

// Clean up old records (older than 30 days)
export const cleanupOldRecords = async (): Promise<void> => {
  if (isIndexedDBAvailable()) {
    await cleanupOldDBRecords();
  } else {
    // Fallback to localStorage
    const records = localStorage.getItem(SPIN_RECORDS_KEY);
    const parsedRecords: SpinRecord[] = records ? JSON.parse(records) : [];
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredRecords = parsedRecords.filter(record => {
      const recordDate = new Date(record.lastSpinDate);
      return recordDate >= thirtyDaysAgo;
    });
    
    if (filteredRecords.length !== parsedRecords.length) {
      saveSpinRecordsToLocalStorage(filteredRecords);
    }
  }
};

// Record a phone number for future reference
export const recordPhoneNumber = async (phoneNumber: string): Promise<void> => {
  // Store in localStorage for easy access
  const phoneNumbers = localStorage.getItem('recordedPhoneNumbers');
  const parsedPhoneNumbers: string[] = phoneNumbers ? JSON.parse(phoneNumbers) : [];
  
  // Only add if it doesn't already exist
  if (!parsedPhoneNumbers.includes(phoneNumber)) {
    parsedPhoneNumbers.push(phoneNumber);
    localStorage.setItem('recordedPhoneNumbers', JSON.stringify(parsedPhoneNumbers));
    
    // Also log to console for debugging
    console.log(`Recorded phone number: ${phoneNumber}`);
  }
};

// Get all recorded phone numbers
export const getRecordedPhoneNumbers = (): string[] => {
  const phoneNumbers = localStorage.getItem('recordedPhoneNumbers');
  return phoneNumbers ? JSON.parse(phoneNumbers) : [];
};

// Initialize by cleaning up old records
cleanupOldRecords();
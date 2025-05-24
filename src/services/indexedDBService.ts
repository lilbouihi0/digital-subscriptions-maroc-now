/**
 * IndexedDB Service for persistent storage
 * This provides a more robust storage solution than localStorage
 * that is harder to clear between sessions and private browsing
 */

// Database configuration
const DB_NAME = 'spinWheelDB';
const DB_VERSION = 1;
const SPIN_STORE = 'spinRecords';

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening database');
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create the spin records store with phone number as key path
      if (!db.objectStoreNames.contains(SPIN_STORE)) {
        const store = db.createObjectStore(SPIN_STORE, { keyPath: 'id' });
        
        // Create indexes for faster queries
        store.createIndex('phoneNumber', 'phoneNumber', { unique: false });
        store.createIndex('deviceId', 'deviceId', { unique: false });
        store.createIndex('lastSpinDate', 'lastSpinDate', { unique: false });
      }
    };
  });
};

// Generic function to perform a database operation
const dbOperation = async <T>(
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SPIN_STORE, 'readwrite');
      const store = transaction.objectStore(SPIN_STORE);
      
      const request = operation(store);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
};

// Interface for spin records
export interface SpinRecord {
  id?: string; // Composite key of phoneNumber + deviceId
  phoneNumber: string;
  deviceId: string;
  lastSpinDate: string;
  gotTryAgain: boolean;
  timestamp: number;
}

// Add or update a spin record
export const saveSpinRecord = async (record: SpinRecord): Promise<void> => {
  // Create a composite ID from phone number and device ID
  const recordToSave = {
    ...record,
    id: `${record.phoneNumber}_${record.deviceId}`
  };
  
  await dbOperation(store => store.put(recordToSave));
};

// Get all spin records
export const getAllSpinRecords = async (): Promise<SpinRecord[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SPIN_STORE, 'readonly');
      const store = transaction.objectStore(SPIN_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to get spin records:', error);
    return [];
  }
};

// Get spin records for a specific phone number
export const getSpinRecordsByPhone = async (phoneNumber: string): Promise<SpinRecord[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SPIN_STORE, 'readonly');
      const store = transaction.objectStore(SPIN_STORE);
      const index = store.index('phoneNumber');
      const request = index.getAll(IDBKeyRange.only(phoneNumber));
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to get spin records by phone:', error);
    return [];
  }
};

// Get spin records for a specific device ID
export const getSpinRecordsByDevice = async (deviceId: string): Promise<SpinRecord[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SPIN_STORE, 'readonly');
      const store = transaction.objectStore(SPIN_STORE);
      const index = store.index('deviceId');
      const request = index.getAll(IDBKeyRange.only(deviceId));
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to get spin records by device:', error);
    return [];
  }
};

// Get spin records for today
export const getTodaySpinRecords = async (): Promise<SpinRecord[]> => {
  try {
    const today = new Date().toDateString();
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SPIN_STORE, 'readonly');
      const store = transaction.objectStore(SPIN_STORE);
      const index = store.index('lastSpinDate');
      const request = index.getAll(IDBKeyRange.only(today));
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to get today\'s spin records:', error);
    return [];
  }
};

// Delete old records (older than 30 days)
export const cleanupOldRecords = async (): Promise<void> => {
  try {
    const db = await initDB();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffTime = thirtyDaysAgo.getTime();
    
    const transaction = db.transaction(SPIN_STORE, 'readwrite');
    const store = transaction.objectStore(SPIN_STORE);
    const request = store.openCursor();
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const record = cursor.value as SpinRecord;
        if (record.timestamp < cutoffTime) {
          store.delete(cursor.primaryKey);
        }
        cursor.continue();
      }
    };
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Failed to cleanup old records:', error);
  }
};

// Fallback to localStorage if IndexedDB is not available
export const isIndexedDBAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'indexedDB' in window;
};
export const StorageKeys = {
  AUTH_TOKEN: 'finapp:auth_token',
  USER_DATA: 'finapp:user_data',
  THEME_PREFERENCE: 'finapp:theme_preference',
} as const;

interface IStorage {
  getString: (key: string) => string | null;
  setString: (key: string, value: string) => void;
  delete: (key: string) => void;
  clearAll: () => void;
}

class FallbackStorage implements IStorage {
  private memoryStore = new Map<string, string>();

  getString(key: string): string | null {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      try {
        return (globalThis as any).localStorage.getItem(key);
      } catch {
        // Fallback to memory
      }
    }
    return this.memoryStore.get(key) ?? null;
  }

  setString(key: string, value: string): void {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      try {
        (globalThis as any).localStorage.setItem(key, value);
      } catch {
        // Fallback to memory
      }
    }
    this.memoryStore.set(key, value);
  }

  delete(key: string): void {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      try {
        (globalThis as any).localStorage.removeItem(key);
      } catch {
        // Fallback to memory
      }
    }
    this.memoryStore.delete(key);
  }

  clearAll(): void {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      try {
        (globalThis as any).localStorage.clear();
      } catch {
        // Fallback to memory
      }
    }
    this.memoryStore.clear();
  }
}

function initializeStorage(): IStorage {
  try {
    // Dynamically require to avoid crash if native bindings are absent in Expo Go
    const { MMKV } = require('react-native-mmkv');
    const instance = new MMKV({ id: 'finapp-storage' });

    // Validate that instance methods work
    instance.getString('__test__');

    return {
      getString: (key: string) => instance.getString(key) ?? null,
      setString: (key: string, value: string) => instance.set(key, value),
      delete: (key: string) => instance.delete(key),
      clearAll: () => instance.clearAll(),
    };
  } catch {
    // Expo Go / Web / Environment without native C++ MMKV binaries
    return new FallbackStorage();
  }
}

export const storage = initializeStorage();

export const appStorage = {
  getString: (key: string): string | null => {
    return storage.getString(key);
  },
  setString: (key: string, value: string): void => {
    storage.setString(key, value);
  },
  getObject: <T>(key: string): T | null => {
    const raw = storage.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setObject: <T>(key: string, value: T): void => {
    storage.setString(key, JSON.stringify(value));
  },
  removeItem: (key: string): void => {
    storage.delete(key);
  },
  clearAll: (): void => {
    storage.clearAll();
  },
};

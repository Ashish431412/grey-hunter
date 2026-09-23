import EncryptedStorage from 'react-native-encrypted-storage';
import { useCallback } from 'react';

export const useEncryptedStorage = () => {
  const setItem = useCallback(async (key: string, value: string) => {
    try {
      await EncryptedStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to encrypted storage`, error);
      return false;
    }
  }, []);

  const getItem = useCallback(async (key: string) => {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading ${key} from encrypted storage`, error);
      return null;
    }
  }, []);

  const removeItem = useCallback(async (key: string) => {
    try {
      await EncryptedStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from encrypted storage`, error);
      return false;
    }
  }, []);

  const clear = useCallback(async () => {
    try {
      await EncryptedStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing encrypted storage', error);
      return false;
    }
  }, []);

  return { setItem, getItem, removeItem, clear };
};

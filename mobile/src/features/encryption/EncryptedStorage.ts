import { NativeModules } from 'react-native';
import 'react-native-get-random-values'; // Polyfill for crypto.getRandomValues if needed

const { EncryptedStorageModule } = NativeModules;

export class EncryptedStorage {
  /**
   * Encrypts and saves data to a file using AES-256-GCM.
   */
  static async save(filename: string, data: string, keyId: string): Promise<boolean> {
    try {
      await EncryptedStorageModule.saveData(filename, data, keyId);
      return true;
    } catch (e) {
      console.error('Failed to save encrypted file', e);
      return false;
    }
  }

  /**
   * Decrypts and loads data from a file.
   */
  static async load(filename: string, keyId: string): Promise<string | null> {
    try {
      return await EncryptedStorageModule.loadData(filename, keyId);
    } catch (e) {
      console.error('Failed to load encrypted file', e);
      return null;
    }
  }

  static async delete(filename: string): Promise<boolean> {
    try {
      await EncryptedStorageModule.deleteFile(filename);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async list(): Promise<string[]> {
    try {
      return await EncryptedStorageModule.listFiles();
    } catch (e) {
      return [];
    }
  }
}

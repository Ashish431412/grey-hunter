import { NativeModules } from 'react-native';

const { CryptoModule } = NativeModules;

export class KeyManager {
  static async deriveKey(password: string, salt: string, iterations: number = 100000): Promise<string> {
    // Uses PBKDF2 under the hood in native module
    try {
      return await CryptoModule.pbkdf2(password, salt, iterations, 256, 'SHA-256');
    } catch (e) {
      throw new Error('Key derivation failed');
    }
  }

  static async rotateMasterKey(oldKey: string, newKey: string): Promise<boolean> {
    try {
      // Re-encrypt the Data Encryption Key (DEK) with the new Master Key
      return await CryptoModule.rotateKey(oldKey, newKey);
    } catch (e) {
      return false;
    }
  }
}

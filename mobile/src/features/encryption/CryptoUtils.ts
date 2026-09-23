import { NativeModules } from 'react-native';

const { CryptoUtilsModule } = NativeModules;

export class CryptoUtils {
  static async sha256(data: string): Promise<string> {
    return await CryptoUtilsModule.sha256(data);
  }

  static async hmac(data: string, key: string): Promise<string> {
    return await CryptoUtilsModule.hmacSha256(data, key);
  }

  static async randomBytes(length: number): Promise<string> {
    return await CryptoUtilsModule.randomBytesBase64(length);
  }

  static base64Encode(data: string): string {
    return btoa(data);
  }

  static base64Decode(data: string): string {
    return atob(data);
  }
}

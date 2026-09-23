import * as Keychain from 'react-native-keychain';

export class SecureVault {
  static async storeCredentials(key: string, value: string, service?: string): Promise<boolean> {
    try {
      const options: Keychain.Options = service ? { service } : {};
      await Keychain.setGenericPassword(key, value, options);
      return true;
    } catch (error) {
      console.error('SecureVault error storing credentials', error);
      return false;
    }
  }

  static async retrieveCredentials(service?: string): Promise<{ username: string; password: string } | null> {
    try {
      const options: Keychain.Options = service ? { service } : {};
      const credentials = await Keychain.getGenericPassword(options);
      if (credentials) {
        return {
          username: credentials.username,
          password: credentials.password
        };
      }
      return null;
    } catch (error) {
      console.error('SecureVault error retrieving credentials', error);
      return null;
    }
  }

  static async deleteCredentials(service?: string): Promise<boolean> {
    try {
      const options: Keychain.Options = service ? { service } : {};
      return await Keychain.resetGenericPassword(options);
    } catch (error) {
      console.error('SecureVault error deleting credentials', error);
      return false;
    }
  }
}

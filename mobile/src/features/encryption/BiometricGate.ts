import ReactNativeBiometrics from 'react-native-biometrics';

export class BiometricGate {
  private static rnBiometrics = new ReactNativeBiometrics();

  static async checkSupport(): Promise<{ supported: boolean; type?: string }> {
    const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();
    return {
      supported: available,
      type: biometryType
    };
  }

  static async authenticate(promptMessage: string = 'Authenticate to access secure vault'): Promise<boolean> {
    try {
      const { success } = await this.rnBiometrics.simplePrompt({ promptMessage });
      return success;
    } catch (error) {
      console.error('Biometric auth error', error);
      return false;
    }
  }
}

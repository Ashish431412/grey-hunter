import { useState, useCallback } from 'react';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const useBiometrics = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);

  const checkAvailability = useCallback(async () => {
    try {
      const { available, biometryType: type } = await rnBiometrics.isSensorAvailable();
      setIsAvailable(available);
      setBiometryType(type || null);
      return available;
    } catch (error) {
      console.error('Biometrics check failed', error);
      return false;
    }
  }, []);

  const authenticate = useCallback(async (promptMessage: string = 'Authenticate to continue') => {
    try {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage });
      return success;
    } catch (error) {
      console.error('Biometric auth failed', error);
      return false;
    }
  }, []);

  const createKeys = useCallback(async () => {
    try {
      const { publicKey } = await rnBiometrics.createKeys();
      return publicKey;
    } catch (error) {
      console.error('Failed to create biometric keys', error);
      return null;
    }
  }, []);

  return {
    isAvailable,
    biometryType,
    BiometryTypes,
    checkAvailability,
    authenticate,
    createKeys,
  };
};

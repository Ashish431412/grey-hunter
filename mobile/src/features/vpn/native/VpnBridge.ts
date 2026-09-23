import { NativeModules, NativeEventEmitter } from 'react-native';

const { VpnNativeModule } = NativeModules;
const vpnEmitter = new NativeEventEmitter(VpnNativeModule);

export class VpnBridge {
  static initialize(onStateChange: (state: string) => void) {
    vpnEmitter.addListener('VpnStateChanged', (event: { state: string }) => {
      onStateChange(event.state);
    });
  }

  static async connect(configData: string): Promise<boolean> {
    try {
      return await VpnNativeModule.connect(configData);
    } catch (e) {
      console.error('VPN connect failed', e);
      return false;
    }
  }

  static async disconnect(): Promise<void> {
    await VpnNativeModule.disconnect();
  }
}

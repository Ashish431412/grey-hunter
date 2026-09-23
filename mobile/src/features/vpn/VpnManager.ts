import { NativeModules, NativeEventEmitter } from 'react-native';

const { VpnModule } = NativeModules;
const vpnEmitter = new NativeEventEmitter(VpnModule);

export enum VpnState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING',
  ERROR = 'ERROR'
}

export class VpnManager {
  private static currentState: VpnState = VpnState.DISCONNECTED;
  private static listeners: Set<(state: VpnState) => void> = new Set();

  static initialize() {
    vpnEmitter.addListener('VpnStateChanged', (event: { state: string }) => {
      this.currentState = event.state as VpnState;
      this.notifyListeners();
    });
  }

  static async connect(config: string): Promise<boolean> {
    try {
      this.currentState = VpnState.CONNECTING;
      this.notifyListeners();
      
      const success = await VpnModule.connect(config);
      if (!success) {
        this.currentState = VpnState.ERROR;
        this.notifyListeners();
      }
      return success;
    } catch (e) {
      this.currentState = VpnState.ERROR;
      this.notifyListeners();
      return false;
    }
  }

  static async disconnect(): Promise<void> {
    this.currentState = VpnState.DISCONNECTING;
    this.notifyListeners();
    await VpnModule.disconnect();
  }

  static getState(): VpnState {
    return this.currentState;
  }

  static subscribe(listener: (state: VpnState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentState));
  }
}

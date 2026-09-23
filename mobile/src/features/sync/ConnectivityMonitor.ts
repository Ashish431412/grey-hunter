export type ConnectionType = 'wifi' | 'cellular' | 'none';

type ConnectivityCallback = (isConnected: boolean) => void;

export class ConnectivityMonitor {
  private connected: boolean = true;
  private type: ConnectionType = 'wifi';
  private listeners: Set<ConnectivityCallback> = new Set();
  private reconnectListeners: Set<() => void> = new Set();

  constructor() {
    // In real app, NetInfo.addEventListener(...)
  }

  subscribe(callback: ConnectivityCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  isConnected(): boolean {
    return this.connected;
  }

  getConnectionType(): ConnectionType {
    return this.type;
  }

  onReconnect(callback: () => void) {
    this.reconnectListeners.add(callback);
    return () => this.reconnectListeners.delete(callback);
  }

  // Method for mocking changes
  mockStateChange(connected: boolean, type: ConnectionType) {
    const wasDisconnected = !this.connected;
    this.connected = connected;
    this.type = type;

    this.listeners.forEach((cb) => cb(this.connected));

    if (wasDisconnected && this.connected) {
      this.reconnectListeners.forEach((cb) => cb());
    }
  }
}

export const connectivityMonitor = new ConnectivityMonitor();

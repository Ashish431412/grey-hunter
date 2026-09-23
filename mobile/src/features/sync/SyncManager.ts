type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export class SyncManager {
  private static status: SyncStatus = 'idle';
  private static listeners: Set<(status: SyncStatus) => void> = new Set();
  private static queue: any[] = [];

  static getStatus(): SyncStatus {
    return this.status;
  }

  static subscribe(listener: (status: SyncStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static updateStatus(newStatus: SyncStatus) {
    this.status = newStatus;
    this.listeners.forEach(listener => listener(newStatus));
  }

  static async queueOperation(operation: any) {
    this.queue.push(operation);
    // Persist queue to local storage here
    
    if (this.status !== 'syncing' && this.status !== 'offline') {
      await this.executeSync();
    }
  }

  static async executeSync() {
    if (this.queue.length === 0) return;
    if (this.status === 'offline') return;

    this.updateStatus('syncing');

    try {
      while (this.queue.length > 0) {
        const op = this.queue[0];
        // Execute operation against backend
        // await BackendAPI.execute(op);
        
        // Remove successful operation
        this.queue.shift();
      }
      this.updateStatus('idle');
    } catch (error) {
      console.error('Sync failed', error);
      this.updateStatus('error');
    }
  }

  static setNetworkStatus(isOnline: boolean) {
    if (!isOnline) {
      this.updateStatus('offline');
    } else if (this.status === 'offline') {
      this.updateStatus('idle');
      this.executeSync();
    }
  }
}

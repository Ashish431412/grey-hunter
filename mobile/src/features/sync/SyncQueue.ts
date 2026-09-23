export interface SyncAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

export class SyncQueue {
  private queue: SyncAction[] = [];

  constructor() {
    // In real app, load from AsyncStorage
  }

  async enqueue(action: SyncAction): Promise<void> {
    this.queue.push(action);
    await this.persist();
  }

  async dequeue(): Promise<SyncAction | undefined> {
    const action = this.queue.shift();
    await this.persist();
    return action;
  }

  peek(): SyncAction | undefined {
    return this.queue[0];
  }

  async clear(): Promise<void> {
    this.queue = [];
    await this.persist();
  }

  getAll(): SyncAction[] {
    return [...this.queue];
  }

  async replay(apiClient: any): Promise<void> {
    while (this.queue.length > 0) {
      const action = this.queue[0];
      try {
        await apiClient.execute(action);
        this.queue.shift(); // remove if success
        await this.persist();
      } catch (err) {
        break; // stop on failure
      }
    }
  }

  private async persist(): Promise<void> {
    // mock AsyncStorage.setItem('syncQueue', JSON.stringify(this.queue))
  }
}

export const syncQueue = new SyncQueue();

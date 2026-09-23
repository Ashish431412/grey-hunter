type RealtimeCallback = (data: any) => void;

export class RealtimeSync {
  private socket: any = null; // Mock socket
  private connected: boolean = false;
  private listeners: Map<string, Set<RealtimeCallback>> = new Map();

  constructor(private url: string) {}

  public connect() {
    this.connected = true;
    this.emitLocal('connect', {});
  }

  public disconnect() {
    this.connected = false;
    this.emitLocal('disconnect', {});
  }

  public joinBoard(boardId: string) {
    if (!this.connected) return;
    // mock join
  }

  public leaveBoard(boardId: string) {
    // mock leave
  }

  public emitTaskCreate(boardId: string, task: any) {
    // Optimistic emit
  }

  public emitTaskUpdate(boardId: string, task: any) {
    // Optimistic emit
  }

  public emitTaskMove(boardId: string, taskId: string, toStatus: string) {
    // Optimistic emit
  }

  public emitTaskDelete(boardId: string, taskId: string) {
    // Optimistic emit
  }

  public on(event: string, callback: RealtimeCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  public off(event: string, callback: RealtimeCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  private emitLocal(event: string, data: any) {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }
}

export const realtimeSync = new RealtimeSync('wss://api.greyhunter.com/realtime');

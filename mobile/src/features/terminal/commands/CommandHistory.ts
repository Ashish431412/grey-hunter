export class CommandHistory {
  private static MAX_HISTORY = 1000;
  private history: string[] = [];
  private pointer: number = -1;

  constructor() {
    this.loadHistory();
  }

  addCommand(command: string) {
    const cmd = command.trim();
    if (!cmd) return;

    // Remove if already exists to move it to the end
    this.history = this.history.filter(c => c !== cmd);
    
    this.history.push(cmd);
    if (this.history.length > CommandHistory.MAX_HISTORY) {
      this.history.shift();
    }
    
    this.pointer = this.history.length;
    this.saveHistory();
  }

  getPrevious(): string | null {
    if (this.history.length === 0) return null;
    if (this.pointer > 0) {
      this.pointer--;
      return this.history[this.pointer];
    }
    return this.history[0];
  }

  getNext(): string | null {
    if (this.history.length === 0) return null;
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      return this.history[this.pointer];
    }
    this.pointer = this.history.length;
    return ''; // Clear prompt when going past the newest
  }

  search(query: string): string[] {
    if (!query) return [];
    return this.history
      .filter(cmd => cmd.toLowerCase().includes(query.toLowerCase()))
      .reverse(); // Newest first
  }

  private loadHistory() {
    // In actual implementation, read from AsyncStorage
    // const saved = AsyncStorage.getItem('cmd_history');
    // if (saved) this.history = JSON.parse(saved);
    this.pointer = this.history.length;
  }

  private saveHistory() {
    // AsyncStorage.setItem('cmd_history', JSON.stringify(this.history));
  }
}

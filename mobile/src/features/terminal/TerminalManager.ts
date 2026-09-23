import { TerminalSession } from './useTerminal';

export class TerminalManager {
  private static MAX_SESSIONS = 8;
  private static sessions: Map<string, TerminalSession> = new Map();
  private static activeSessionId: string | null = null;

  static createSession(id: string, name: string): TerminalSession {
    if (this.sessions.size >= this.MAX_SESSIONS) {
      throw new Error(`Maximum of ${this.MAX_SESSIONS} sessions reached`);
    }

    const newSession: TerminalSession = {
      id,
      name,
      outputQueue: [],
      theme: 'matrix'
    };

    this.sessions.set(id, newSession);
    this.activeSessionId = id;
    
    // Save state
    this.persistState();
    return newSession;
  }

  static destroySession(id: string): void {
    this.sessions.delete(id);
    if (this.activeSessionId === id) {
      this.activeSessionId = this.sessions.size > 0 ? Array.from(this.sessions.keys())[0] : null;
    }
    this.persistState();
  }

  static switchSession(id: string): void {
    if (this.sessions.has(id)) {
      this.activeSessionId = id;
      this.persistState();
    }
  }

  static getActiveSession(): TerminalSession | null {
    if (this.activeSessionId) {
      return this.sessions.get(this.activeSessionId) || null;
    }
    return null;
  }

  static getAllSessions(): TerminalSession[] {
    return Array.from(this.sessions.values());
  }

  private static persistState(): void {
    // Logic to persist session metadata (not full output history due to size) to local storage
    const state = {
      activeSessionId: this.activeSessionId,
      sessions: Array.from(this.sessions.keys()).map(k => ({
        id: k,
        name: this.sessions.get(k)?.name
      }))
    };
    // Storage.setItem('terminal_state', JSON.stringify(state));
  }
}

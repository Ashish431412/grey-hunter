import { NativeModules, NativeEventEmitter } from 'react-native';

const { TerminalNativeModule } = NativeModules;
const terminalEmitter = new NativeEventEmitter(TerminalNativeModule);

export class TerminalBridge {
  static listeners: Map<string, (output: string) => void> = new Map();

  static initialize() {
    terminalEmitter.addListener('TerminalOutput', (event: { sessionId: string; output: string }) => {
      const listener = this.listeners.get(event.sessionId);
      if (listener) {
        listener(event.output);
      }
    });
  }

  static async executeCommand(sessionId: string, command: string, args: string[], env: Record<string, string> = {}): Promise<void> {
    try {
      await TerminalNativeModule.executeCommand(sessionId, command, args, env);
    } catch (e) {
      console.error('Failed to execute command natively', e);
    }
  }

  static async cancelExecution(sessionId: string): Promise<void> {
    await TerminalNativeModule.cancelExecution(sessionId);
  }

  static subscribe(sessionId: string, listener: (output: string) => void) {
    this.listeners.set(sessionId, listener);
    return () => this.listeners.delete(sessionId);
  }
}

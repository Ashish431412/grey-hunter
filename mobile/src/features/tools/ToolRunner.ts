import { TerminalBridge } from '../terminal/native/TerminalBridge';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  code: number;
}

export class ToolRunner {
  static async run(
    sessionId: string,
    toolCommand: string,
    args: string[],
    onOutput?: (chunk: string) => void
  ): Promise<ExecutionResult> {
    let stdoutStr = '';
    let stderrStr = '';

    const unsubscribe = TerminalBridge.subscribe(sessionId, (output: string) => {
      // Simplistic assumption that all output goes to stdout for this mock
      stdoutStr += output;
      if (onOutput) onOutput(output);
    });

    try {
      // Send to native bridge
      await TerminalBridge.executeCommand(sessionId, toolCommand, args, {});
      
      // In a real app, we would await an exit code event from the native bridge.
      // Mocking successful exit code 0 here.
      return { stdout: stdoutStr, stderr: stderrStr, code: 0 };
    } catch (error) {
      stderrStr += error;
      return { stdout: stdoutStr, stderr: stderrStr, code: 1 };
    } finally {
      unsubscribe();
    }
  }

  static async cancel(sessionId: string) {
    await TerminalBridge.cancelExecution(sessionId);
  }
}

import { useState, useCallback, useEffect } from 'react';
import { terminalTheme } from './TerminalTheme';

export interface TerminalSession {
  id: string;
  name: string;
  outputQueue: string[];
  theme: keyof typeof terminalTheme;
}

const sessions: Record<string, TerminalSession> = {};

export const useTerminal = (sessionId: string) => {
  const [session, setSession] = useState<TerminalSession | null>(null);

  useEffect(() => {
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        id: sessionId,
        name: `Session ${sessionId.slice(0, 4)}`,
        outputQueue: [],
        theme: 'matrix'
      };
    }
    setSession(sessions[sessionId]);
  }, [sessionId]);

  const writeToTerminal = useCallback((data: string) => {
    if (sessions[sessionId]) {
      sessions[sessionId].outputQueue.push(data);
      // In a real implementation we would trigger a state update
      setSession({ ...sessions[sessionId] });
    }
  }, [sessionId]);

  const clearTerminal = useCallback(() => {
    if (sessions[sessionId]) {
      sessions[sessionId].outputQueue = [];
      setSession({ ...sessions[sessionId] });
    }
  }, [sessionId]);

  return { session, writeToTerminal, clearTerminal };
};

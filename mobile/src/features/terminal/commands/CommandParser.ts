export interface ParsedCommand {
  command: string;
  args: string[];
  redirectOutput?: string;
  redirectInput?: string;
  pipeCommand?: ParsedCommand;
  envVars?: Record<string, string>;
}

export class CommandParser {
  static parse(input: string): ParsedCommand | null {
    if (!input.trim()) return null;

    const envVars: Record<string, string> = {};
    let commandStr = input.trim();
    
    // Parse environment variables like FOO=bar command args
    const envMatch = commandStr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)=([^ ]+)\s+(.*)$/);
    if (envMatch) {
      envVars[envMatch[1]] = envMatch[2];
      commandStr = envMatch[3];
    }

    // Split by pipe
    const pipeParts = commandStr.split('|').map(p => p.trim());
    
    const rootCmd = this.parseSimpleCommand(pipeParts[0]);
    rootCmd.envVars = envVars;

    let current = rootCmd;
    for (let i = 1; i < pipeParts.length; i++) {
      const nextCmd = this.parseSimpleCommand(pipeParts[i]);
      current.pipeCommand = nextCmd;
      current = nextCmd;
    }

    return rootCmd;
  }

  private static parseSimpleCommand(input: string): ParsedCommand {
    const parts = input.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g) || [];
    
    let command = '';
    const args: string[] = [];
    let redirectOutput: string | undefined;
    let redirectInput: string | undefined;

    for (let i = 0; i < parts.length; i++) {
      let part = parts[i];
      if (part === '>') {
        redirectOutput = parts[++i];
      } else if (part === '<') {
        redirectInput = parts[++i];
      } else if (!command) {
        command = part;
      } else {
        // Remove quotes if any
        if (part.startsWith('"') && part.endsWith('"')) {
          part = part.substring(1, part.length - 1);
        }
        args.push(part);
      }
    }

    return { command, args, redirectOutput, redirectInput };
  }
}

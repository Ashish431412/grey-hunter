import { ToolRunner } from '../ToolRunner';

export class WiresharkCapture {
  static async startCapture(sessionId: string, interfaceName: string, filter?: string): Promise<void> {
    const args = ['-i', interfaceName];
    if (filter) {
      args.push('-f');
      args.push(filter);
    }
    
    await ToolRunner.run(sessionId, 'tshark', args);
  }

  static async stopCapture(sessionId: string): Promise<void> {
    await ToolRunner.cancel(sessionId);
  }

  static parsePcapSummary(output: string): any[] {
    const lines = output.split('\n');
    return lines.map(line => {
      const parts = line.trim().split(/\s+/);
      return {
        id: parts[0],
        time: parts[1],
        source: parts[2],
        dest: parts[4],
        protocol: parts[5],
        info: parts.slice(6).join(' ')
      };
    }).filter(pkt => pkt.id && !isNaN(Number(pkt.id)));
  }
}

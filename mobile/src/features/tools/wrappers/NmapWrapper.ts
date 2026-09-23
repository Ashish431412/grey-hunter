import { ToolRunner } from '../ToolRunner';

export interface NmapParams {
  target: string;
  ports?: string;
  aggressive?: boolean;
  scanType?: '-sS' | '-sT' | '-sU' | '-sn';
  timing?: 0 | 1 | 2 | 3 | 4 | 5;
  osDetection?: boolean;
  versionDetection?: boolean;
}

export class NmapWrapper {
  static buildCommand(params: NmapParams): string[] {
    const args: string[] = [];

    if (params.scanType) args.push(params.scanType);
    if (params.timing !== undefined) args.push(`-T${params.timing}`);
    if (params.osDetection) args.push('-O');
    if (params.versionDetection) args.push('-sV');
    if (params.aggressive) args.push('-A');
    if (params.ports) {
      args.push('-p');
      args.push(params.ports);
    }
    
    args.push('-oX');
    args.push('-'); // Output XML to stdout
    
    args.push(params.target);

    return args;
  }

  static async runScan(sessionId: string, params: NmapParams, onOutput?: (out: string) => void) {
    const args = this.buildCommand(params);
    return ToolRunner.run(sessionId, 'nmap', args, onOutput);
  }
}

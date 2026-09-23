import { ToolRunner } from '../ToolRunner';

export interface SqlmapParams {
  url: string;
  batch?: boolean;
  level?: 1 | 2 | 3 | 4 | 5;
  risk?: 1 | 2 | 3;
  dump?: boolean;
}

export class SqlmapWrapper {
  static buildCommand(params: SqlmapParams): string[] {
    const args: string[] = ['-u', params.url];
    
    if (params.batch) args.push('--batch');
    if (params.level) args.push(`--level=${params.level}`);
    if (params.risk) args.push(`--risk=${params.risk}`);
    if (params.dump) args.push('--dump');
    
    return args;
  }

  static async run(sessionId: string, params: SqlmapParams, onOutput?: (out: string) => void) {
    const args = this.buildCommand(params);
    return ToolRunner.run(sessionId, 'sqlmap', args, onOutput);
  }
}

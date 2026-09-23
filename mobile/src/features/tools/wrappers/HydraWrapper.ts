import { ToolRunner } from '../ToolRunner';

export interface HydraParams {
  target: string;
  protocol: string;
  login?: string;
  loginList?: string;
  password?: string;
  passwordList?: string;
  threads?: number;
}

export class HydraWrapper {
  static buildCommand(params: HydraParams): string[] {
    const args: string[] = [];

    if (params.login) { args.push('-l'); args.push(params.login); }
    else if (params.loginList) { args.push('-L'); args.push(params.loginList); }

    if (params.password) { args.push('-p'); args.push(params.password); }
    else if (params.passwordList) { args.push('-P'); args.push(params.passwordList); }

    if (params.threads) { args.push('-t'); args.push(params.threads.toString()); }

    args.push(params.target);
    args.push(params.protocol);

    return args;
  }

  static async run(sessionId: string, params: HydraParams, onOutput?: (out: string) => void) {
    const args = this.buildCommand(params);
    return ToolRunner.run(sessionId, 'hydra', args, onOutput);
  }
}

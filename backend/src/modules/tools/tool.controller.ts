import { Request, Response, NextFunction } from 'express';
import { ToolService } from './tool.service';

export class ToolController {
  static async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const execution = await ToolService.executeTool(req.user!.id, req.body);
      res.status(202).json({ status: 'success', data: execution });
    } catch (error) {
      next(error);
    }
  }

  static async history(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await ToolService.getHistory(req.user!.id);
      res.status(200).json({ status: 'success', data: history });
    } catch (error) {
      next(error);
    }
  }
}

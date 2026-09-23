import { Request, Response, NextFunction } from 'express';
import { AuditService } from './audit.service';

export class AuditController {
  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await AuditService.getLogs(req.query);
      res.status(200).json({ status: 'success', data: logs });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AuditService.getStats();
      res.status(200).json({ status: 'success', data: stats });
    } catch (error) {
      next(error);
    }
  }
}

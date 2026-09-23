import { Request, Response, NextFunction } from 'express';
import { SyncService } from './sync.service';

export class SyncController {
  static async push(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SyncService.push(req.user!.id, req.body);
      res.status(200).json({ status: 'success', data: { id: result.id } });
    } catch (error) {
      next(error);
    }
  }

  static async pull(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SyncService.pull(req.user!.id, req.query.blobKey as string);
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }
}

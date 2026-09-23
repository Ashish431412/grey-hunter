import { Request, Response, NextFunction } from 'express';
import { TaskService } from './task.service';

export class TaskController {
  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.createTask(req.user!.id, req.body);
      res.status(201).json({ status: 'success', data: task });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.updateTaskStatus(req.params.id, req.body.status);
      res.status(200).json({ status: 'success', data: task });
    } catch (error) {
      next(error);
    }
  }
}

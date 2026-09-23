import { Request, Response, NextFunction } from 'express';
import { ProjectService } from './project.service';

export class ProjectController {
  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.user!.id, req.body);
      res.status(201).json({ status: 'success', data: project });
    } catch (error) {
      next(error);
    }
  }

  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await ProjectService.getProjects(req.user!.id);
      res.status(200).json({ status: 'success', data: projects });
    } catch (error) {
      next(error);
    }
  }
}

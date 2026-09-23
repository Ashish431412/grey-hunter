import { prisma } from '../../config/database';

export class TaskService {
  static async createTask(reporterId: string, data: any) {
    return prisma.task.create({
      data: {
        ...data,
        reporterId
      }
    });
  }

  static async updateTaskStatus(id: string, status: any) {
    return prisma.task.update({
      where: { id },
      data: { status }
    });
  }
}

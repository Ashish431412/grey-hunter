import { prisma } from '../../config/database';

export class ToolService {
  static async executeTool(userId: string, data: any) {
    return prisma.toolExecution.create({
      data: {
        userId,
        toolName: data.toolName,
        parameters: data.parameters,
        status: 'PENDING'
      }
    });
  }

  static async getHistory(userId: string) {
    return prisma.toolExecution.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' }
    });
  }
}

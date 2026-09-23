import { prisma } from '../../config/database';

export class AuditService {
  static async getLogs(filters: any) {
    return prisma.auditLog.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }

  static async getStats() {
    const total = await prisma.auditLog.count();
    return { totalLogs: total };
  }
}
